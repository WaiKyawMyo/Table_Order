import { createBrowserRouter } from "react-router";
import CodeCheck from "../Pages/CodeCheck";
import Home from "../Layout/Home";
import Product from "../Pages/Product";
import MainHome from "../Pages/MainHome";
import YourOrder from "../Pages/YourOrder";

const router = createBrowserRouter([
   {
    path:'/',
    element:<CodeCheck/>
   },
   {
    path:'/home',
    element:<Product><Home/></Product>,
    children:[
      {
        path: '', // Empty string means it matches the parent path exactly (/home)
        element:<MainHome/>
      },{
        path: '/home/yourOrder', 
        element:<YourOrder/>
      },
     
    ]
   }
])

export default router