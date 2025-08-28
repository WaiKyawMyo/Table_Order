import { Router } from "express";
import { checktable, confirm, createOrder, getAllMenu, loginOrder, show_order } from "../Controller/Order";
import checkCode from "../middleware/chackCode";

const route = Router()
route.post("/order",loginOrder)
route.post('/confirm',checktable)
route.get('/allMenu',getAllMenu)
route.post('/makeOrder',createOrder)
route.get('/showOrder',show_order)
// route.get("/confirm",checkCode,confirm)

export default route