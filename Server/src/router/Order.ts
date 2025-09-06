import { Router } from "express";
import { checktable, confirm, createOrder, getAllMenu, help, loginOrder, show_order } from "../Controller/Order";
import checkCode from "../middleware/chackCode";

const route = Router()
route.post("/order", loginOrder);
route.post('/confirm',checktable)
route.get('/allMenu',getAllMenu)
route.post('/makeOrder',createOrder)
route.post('/showOrder',show_order)
route.put("/help",help)


export default route