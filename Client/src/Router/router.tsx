import { createBrowserRouter } from "react-router";
import CodeCheck from "../Pages/CodeCheck";
import Home from "../Layout/Home";
import Product from "../Pages/Product";
import MainHome from "../Pages/MainHome";
import YourOrder from "../Pages/YourOrder";
import PageNotFound from "../Pages/pageNotFound";

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
        path: '/home/main', // Empty string means it matches the parent path exactly (/home)
        element:<MainHome/>
      },{
        path: '/home/yourOrder', 
        element:<YourOrder/>
      },
      {
        path:"*",
        element:<PageNotFound/>
      }
     
    ]
   },{
        path:"*",
        element:<CodeCheck/>
      }
])

export default router