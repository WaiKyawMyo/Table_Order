import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";
import { CheckCodeRequest } from "../middleware/chackCode";
import { Table } from "../Models/table";
import { generateToken } from "../Utils/generateToken";
import { Menu } from "../Models/Menu";
import { Set } from "../Models/Set";
import { TableOrder } from "../Models/TableOrder";
import { OrderMenu } from "../Models/Order_Menu";
import { Customer } from "../Models/Customer";
import { CustomerOrder } from "../Models/CustomerOrder";
import mongoose from "mongoose";
import { Discount } from "../Models/discount";

export const loginOrder = asyncHandler(async(req:CheckCodeRequest,res:Response)=>{
  
       const { code } = req.body;
       
       // Type-safe validation
       if (!code ) {
             res.status(400).json({ 
               success: false, 
               message: "Valid code is required" 
           });
       }
   
       // Assuming you're using Mongoose or similar ORM
       const table = await Table.findOne({ code });
       
       if (!table) {
            res.status(401).json({ 
               success: false, 
               message: "Invalid code" 
           });
       }else{
         generateToken(res,table?._id)
        res.status(200).json({message:"Code is correct",table_id:table._id})
       }
       
       
      
})
export const checktable = asyncHandler(async(req:Request,res:Response)=>{
    const {_id} = req.body 
    if (!_id) {
         res.status(400).json({ 
               success: false, 
               
           });

    }
    const checktable = await Table.findById({_id})
    if(!checktable){
        res.status(400).json({ 
               success: false, 
               
           });
    }
    res.status(200).json({
        success:true
    })
})

export const getAllMenu = asyncHandler(async (req: Request, res: Response) => {
  const menu = await Menu.find();
  const sets = await Set.aggregate([
    {
      $lookup: {
        from: "set_menus",
        let: { setId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$set_id", "$$setId"] } } },
          {
            $lookup: {
              from: "menus",
              localField: "menu_id",
              foreignField: "_id",
              as: "menu",
            },
          },
          {
            $unwind: "$menu",
          },
          {
            $project: {
              _id: 0,
              unit_Quantity: 1,
              menu: 1,
            },
          },
        ],
        as: "sets",
      },
    },
  ]);

  if (menu.length === 0 && sets.length === 0) {
     res.status(404).json({ message: "No menu or sets found" });
  }

  res.status(200).json({ menu: menu, sets: sets });
});

export const confirm = asyncHandler(async(req:CheckCodeRequest,res:Response)=>{
    const table = req.table
    res.status(200).json({message:"Success",table})
})

export const createOrder = asyncHandler(async(req: Request, res: Response) => {
    const { 
        table_id, 
        order_items, 
        
        
    } = req.body;
    
    
    

    
    

    // Validate required fields - THROW ERRORS instead of return
   

    
    
    if (!table_id || !order_items || order_items.length === 0) {
        throw new Error("Table ID and order items are required");
    }
    
    

    // Validate table exists
    const table = await Table.findById(table_id);
    if (!table) {
        throw new Error("Table not found");
    }

    let subtotal = 0;
    let orderMenuItems = [];

    // Process each order item
    for (const item of order_items) {
        const { menu_id, quantity, set_id } = item;

        // Validate quantity
        const validQuantity = Number(quantity) || 0;
        if (validQuantity <= 0) {
            throw new Error("Invalid quantity");
        }

        if (menu_id) {
            // Validate menu item exists and is available
            const menu = await Menu.findById(menu_id);
            if (!menu) {
                throw new Error(`Menu item with ID ${menu_id} not found`);
            }
            
            const validPrice = Number(menu.price) || 0;
            const itemTotal = validPrice * validQuantity;
            subtotal += itemTotal;
            
            
        }

        if (set_id) {
            // Validate set exists and is available
            const set = await Set.findById(set_id);
            if (!set) {
                throw new Error(`Set with ID ${set_id} not found`);
            }
            
            const validPrice = Number(set.price) || 0;
            const itemTotal = validPrice * validQuantity;
            subtotal += itemTotal;
            
           
        }

        // Prepare order menu item
        if (menu_id) {
            orderMenuItems.push({
                menu_id: menu_id,
                quantity: validQuantity,
                table_id
            });
        } else {
            orderMenuItems.push({
                set_id: set_id,
                quantity: validQuantity,
                table_id
            });
        }
    }
    
    // Validate subtotal
    if (isNaN(subtotal) || subtotal < 0) {
        throw new Error("Invalid subtotal calculated");
    }
    const customer = await Customer.findOne({table_id}).sort({time:-1})
    if(!customer){
        throw new Error("There is no customer");
    }
    const discountdata = await Discount.find().limit(1)
    

   
    // Create the main order
    const order = await TableOrder.create({
        time: new Date(),
       
        table_id,
        total: Number(subtotal.toFixed(2)),
        status: "pending"
    });

    const discountPrice = (order.total * discountdata[0].persent)/100

    const tax_rate = 0.1
    const tax_amount = order.total * tax_rate
    const realTotal = order.total + tax_amount + 2500 - discountPrice

    customer.total = realTotal + customer.total
    await customer.save()
    
    const orderCustomer = await CustomerOrder.create({
        customer_id:customer._id,
        tableOrder_id:order._id
    })

    // Add order_id to each order menu item and create them
    const orderMenuItemsWithOrderId = orderMenuItems.map(item => ({
        ...item,
        order_id: order._id
    }));

    // Create order menu items
    if (Array.isArray(orderMenuItemsWithOrderId)) {
        for (const item of orderMenuItemsWithOrderId) {
            await OrderMenu.create({
                menu_id: item.menu_id || null,
                quantity: item.quantity,
                set_id: item.set_id || null,
                order_id: item.order_id,
                table_id: item.table_id
            });
        }
    }


    // Get order items with populated data
    const orderItemsWithDetails = await OrderMenu.find({ order_id: order._id })
        .populate('menu_id', 'name type price image is_available cloudinary_id')
        .populate('set_id', 'name price')
        .populate('table_id', 'table_No capacity')
        .populate('order_id');

    // Populate the order
    const populatedOrder = await TableOrder.findById(order._id)
        // .populate('user_id', 'name email phone role')
        .populate('table_id', 'table_No capacity');

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: {
            order: populatedOrder,
            order_items: orderItemsWithDetails,
            summary: {
                order_id: order._id,
                table_number: table.table_No,
                total_items: orderItemsWithDetails.length,
               
                total: order.total,
                order_time: order.time
            }
        }
    });
});

export const show_order = asyncHandler(async(req, res) => {
    const { table_id } = req.body;
    
    if (!table_id) {
        throw new Error("Table ID is required");
    }

    const result = await Customer.aggregate([
        // Match customer by table_id
        { $match: { table_id: new mongoose.Types.ObjectId(table_id) } },
        { $sort: { time: -1 } },
        { $limit: 1 },
        
        // Lookup customer orders
        {
            $lookup: {
                from: 'customerorders',
                localField: '_id',
                foreignField: 'customer_id',
                as: 'customerOrders'
            }
        },
        
        // Lookup table orders
        {
            $lookup: {
                from: 'tableorders',
                localField: 'customerOrders.tableOrder_id',
                foreignField: '_id',
                as: 'tableOrders'
            }
        },
        
        // Lookup order menu items
        {
            $lookup: {
                from: 'ordermenus',
                let: { orderIds: '$tableOrders._id' },
                pipeline: [
                    { $match: { $expr: { $in: ['$order_id', '$$orderIds'] } } },
                    // Lookup menu details
                    {
                        $lookup: {
                            from: 'menus',
                            localField: 'menu_id',
                            foreignField: '_id',
                            as: 'menuDetails'
                        }
                    },
                    // Lookup set details
                    {
                        $lookup: {
                            from: 'sets',
                            localField: 'set_id',
                            foreignField: '_id',
                            as: 'setDetails'
                        }
                    }
                ],
                as: 'orderItems'
            }
        }
    ]);

    if (!result.length) {
         res.status(404).json({
            success: false,
            message: "No customer found for this table"
        });
    }

    res.status(200).json({
        success: true,
        data: result[0]
    });
});