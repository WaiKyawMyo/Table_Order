import { Outlet } from "react-router";
import Header from "./Header";

function Home() {
  return (
    <>
      <Header/>
      <div className="mt-21 lg:mt-21">
        <Outlet/>
      </div>
      
    </>
  )
}

export default Home