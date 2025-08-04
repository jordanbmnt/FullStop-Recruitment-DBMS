import { Outlet } from "react-router-dom";
import darkModeLogo from "../../assets/logos/darkModeLogoEmblem.png";
import { useState } from "react";
import { UserMenu } from "./user_menu";
import { Sidebar } from "./sidebar";
import { MenuIcon } from "lucide-react";

const DashboardSidebar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div>
      <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
        <div className='px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start rtl:justify-end'>
              <button
                onClick={() => {
                  setIsSideBarOpen(!isSideBarOpen)
                }}
                aria-controls='logo-sidebar'
                type='button'
                className='inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
              >
                <span className='sr-only'>Open sidebar</span>
                <MenuIcon />
              </button>
              <a href='/' className='flex ms-2 md:me-24'>
                <img
                  src={darkModeLogo}
                  className='h-10 me-3'
                  alt='Fullstop Recruitment Logo'
                />
                <span style={{
                  fontFamily: "EB Garamond",
                  fontOpticalSizing: "auto",
                  fontWeight: 500,
                  fontStyle: "normal",
                }} className='self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white'>
                  Fullstop Recruitment
                </span>
              </a>
            </div>
            <UserMenu />
          </div>
        </div>
      </nav >

      <Sidebar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>

      <div className='p-4 sm:ml-64 mt-16'>
        <Outlet />
      </div>
    </div >
  );
};

export default DashboardSidebar;
