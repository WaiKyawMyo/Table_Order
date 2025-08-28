import { NavLink, UNSAFE_decodeViaTurboStream } from 'react-router'
import { useState } from 'react'
import image from '../assets/Logo.svg'
import { useHelpMutation } from '../Slice/API/tableApi'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import {  toast, } from 'react-toastify'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const tableInfo = useSelector((state: RootState) => state.auth.table)
  const [help]= useHelpMutation()

  const handleHelp = async () => {
  try {
     // Optional: disable button temporarily
    const res = await help({table_id: tableInfo.table_id})
    
    toast.success(res.data.message)
    
  } catch (error) {
    toast.error(error.response?.data?.message || "Unable to send help request. Please try again.")
  } 
}
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div>
   
    

    <nav className="bg-amber-50 dark:bg-amber-900 fixed w-full z-20 top-0 start-0 border-b border-amber-200 dark:border-amber-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <NavLink to="/home/main" className="flex items-center">
          <img src={image} className="h-17 bg-amber-50 rounded-xl" alt="Restaurant Logo"/>
          <div className='ml-2 hidden sm:block'>
            <span className='self-center  md:text-2xl font-semibold whitespace-nowrap dark:text-white'>MuMu</span><br />
            <span className='self-center md:text-xl font-semibold whitespace-nowrap dark:text-white'>Restaurant</span>
          </div>
        </NavLink>
        
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button type="button" onClick={handleHelp} className="text-white bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-amber-700 dark:hover:bg-amber-800 dark:focus:ring-amber-800">
            Need Help?
          </button>
          
          {/* Mobile menu toggle button */}
          <button 
            onClick={toggleMobileMenu}
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-amber-600 rounded-lg md:hidden hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:text-amber-300 dark:hover:bg-amber-800 dark:focus:ring-amber-600" 
            aria-controls="navbar-sticky" 
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        
        {/* Navigation menu */}
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-amber-200 rounded-lg bg-amber-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-amber-50 dark:bg-amber-800 md:dark:bg-amber-900 dark:border-amber-700">
            <li>
              <NavLink 
                to="/home/main" 
                className={({ isActive }) => 
                  `block py-2 px-3 rounded-sm md:p-0 transition-colors ${
                    isActive 
                      ? 'text-white bg-amber-600 md:bg-transparent md:text-amber-700 md:dark:text-amber-400' 
                      : 'text-amber-800 hover:bg-amber-200 md:hover:bg-transparent md:hover:text-amber-600 dark:text-amber-200 dark:hover:bg-amber-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-amber-400'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/home/yourOrder" 
                className={({ isActive }) => 
                  `block py-2 px-3 rounded-sm md:p-0 transition-colors ${
                    isActive 
                      ? 'text-white bg-amber-600 md:bg-transparent md:text-amber-700 md:dark:text-amber-400' 
                      : 'text-amber-800 hover:bg-amber-200 md:hover:bg-transparent md:hover:text-amber-600 dark:text-amber-200 dark:hover:bg-amber-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-amber-400'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Order
              </NavLink>
            </li>
              
            
          </ul>
        </div>
      </div>
    </nav>
    </div>
  )
}

export default Header