import { useEffect, useState } from "react";
import { useGetAllMenuMutation, useMakeOrderMutation } from "../Slice/API/tableApi";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  is_avaliable: boolean;
  image?: string;
  cloudinary_id?: string;
}

interface SetMenuItem {
  _id: string;
  menu?: MenuItem;
  quantity: number;
}

interface Set {
  _id: string;
  name: string;
  price: number;
  image?: string;
  menu_items?: SetMenuItem[];
  is_available: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'menu' | 'set';
}

interface ApiResponse {
  data?: {
    menu?: MenuItem[];
    sets?: Set[];
  };
}

function MainHome() {
  const [loading, setLoading] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [getall] = useGetAllMenuMutation();
  const [order] = useMakeOrderMutation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'sets'>('sets');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res: ApiResponse = await getall({});
        console.log(res);
        if (res?.data) {
          setMenuItems(res.data.menu || []);
          setSets(res.data.sets || []);
        } else {
          console.error("API response did not contain expected data.");
          toast.error("Failed to load menu items.");
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast.error("Error fetching menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getall]);

  const addToOrder = (item: MenuItem | Set, type: 'menu' | 'set') => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item._id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === item._id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      const newOrderItem: OrderItem = {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        type: type
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
    
    
  };

  const increaseQuantity = (id: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQuantity = (id: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    ));
  };

  const removeFromOrder = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    toast.info("Item removed from order");
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const viewOrder = () => {
    setShowOrderModal(true);
  };

  const clearOrder = () => {
    setOrderItems([]);
    setShowOrderModal(false);
    toast.success("Order cleared");
  };
const tableInfo = useSelector((state: RootState) => state.auth.table)

  const makeOrder = async () => {
    
    const table_id = tableInfo.table_id
    if (!table_id ) {
      toast.error("Missing table or reservation information");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Your order is empty");
      return;
    }
console.log("OrderItems:",orderItems)
    setSubmittingOrder(true);
    
    try {
      // Convert orderItems to API format
      const order_items = orderItems.map(item => {
        if (item.type === 'menu') {
          return {
            menu_id: item.id,
            quantity: item.quantity
          };
        } else {
          return {
            set_id: item.id,
            quantity: item.quantity
          };
        }
      });

      const orderData = {
        table_id,
       
        order_items
      };

      console.log("Sending order:", orderData);

      const response = await order(orderData).unwrap();
      
      toast.success(`Order placed successfully!`);
      console.log("Order response:", response);
      
      // Clear the order and close modal
      setOrderItems([]);
      setShowOrderModal(false);
      
      // Optional: You can navigate to an order confirmation page here
      // navigate(`/order-confirmation/${response.data.summary.order_id}`);
      
    } catch (error: any) {
      console.error("Order failed:", error);
      let errorMessage = "Failed to place order. Please try again.";

      if (error.status === 'PARSING_ERROR') {
        // This happens when the server returns an HTML error page instead of a JSON response.
        console.error("Server returned non-JSON response:", error.data);
        errorMessage = "An unexpected error occurred on the server. Please try again later.";
      } else if (error.data?.message) {
        // API returned a structured error message.
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-amber-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pb-24">
      <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('sets')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'sets'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              🍽️ Set Meals
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'menu'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              🍴 Menu
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'sets' && sets.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center">
              🍽️ Special Set Meals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sets.map((set) => (
                <div key={set._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    {set.image ? (
                      <img 
                        src={set.image} 
                        alt={set.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-800 mb-2">{set.name}</h3>
                    <div className="text-2xl font-bold text-amber-600 mb-3">
                      {set.price} MMK
                    </div>
                    
                    {set.menu_items && set.menu_items.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Includes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {set.menu_items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.menu?.name || 'Unknown item'}</span>
                              <span className="text-amber-600">x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => addToOrder(set, 'set')}
                      className="w-full py-2 rounded-lg font-medium transition-colors bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'menu' && menuItems.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center">
              🍴 Our Menu
            </h2>
            
            {/* Group menu items by type */}
            {Object.entries(
              menuItems.reduce((acc, item) => {
                if (!acc[item.type]) acc[item.type] = [];
                acc[item.type].push(item);
                return acc;
              }, {} as Record<string, MenuItem[]>)
            ).map(([type, items]) => (
              <div key={type} className="mb-12">
                <h3 className="text-2xl font-semibold text-amber-700 mb-6 capitalize">
                  {type}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                            <span className="text-4xl">🍽️</span>
                          </div>
                        )}
                        {!item.is_avaliable && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold">Not Available</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-amber-800 mb-2">{item.name}</h4>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-amber-600">
                            {item.price} MMK
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.is_avaliable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.is_avaliable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => addToOrder(item, 'menu')}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            item.is_avaliable 
                              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!item.is_avaliable}
                        >
                          {item.is_avaliable ? 'Add to Order' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State for Sets */}
        {activeTab === 'sets' && sets.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-amber-800 mb-2">No Set Meals Available</h3>
            <p className="text-amber-600">Our set meals will be available soon. Please check back later!</p>
          </div>
        )}

        {/* Empty State for Menu */}
        {activeTab === 'menu' && menuItems.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍴</div>
            <h3 className="text-2xl font-bold text-amber-800 mb-2">No Menu Items Available</h3>
            <p className="text-amber-600">Our menu will be available soon. Please check back later!</p>
          </div>
        )}
      </div>

      {/* Floating View Order Button */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={viewOrder}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 animate-bounce"
          >
            <div className="bg-white text-amber-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              {getTotalItems()}
            </div>
            <span className="font-semibold">View Order</span>
            <span className="font-bold">{getTotalPrice()} MMK</span>
          </button>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-amber-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <h2 className="text-2xl font-bold text-amber-800">Your Order</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[40vh] bg-white">
              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500">Your order is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-800">{item.name}</h4>
                        <p className="text-amber-600">{item.price} MMK each</p>
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full capitalize">
                          {item.type === 'menu' ? 'Menu Item' : 'Set Meal'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Decrease Button */}
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors shadow-md"
                        >
                          -
                        </button>
                        
                        {/* Quantity */}
                        <span className="font-bold text-lg min-w-[2rem] text-center text-amber-800">
                          {item.quantity}
                        </span>
                        
                        {/* Increase Button */}
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors shadow-md"
                        >
                          +
                        </button>
                        
                        {/* Total Price for this item */}
                        <div className="text-right min-w-[4rem]">
                          <div className="font-bold text-amber-600">
                            {(item.price * item.quantity)} MMK
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromOrder(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-xl ml-2 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                          title="Remove from order"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {orderItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-amber-800">
                    Total ({getTotalItems()} items):
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    {getTotalPrice()} MMK
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={clearOrder}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors shadow-md"
                  >
                    Clear Order
                  </button>
                  <button
                    onClick={makeOrder}
                    disabled={submittingOrder}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors shadow-md ${
                      submittingOrder 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {submittingOrder ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainHome;