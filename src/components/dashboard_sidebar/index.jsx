import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./sidebar";
// import { MenuIcon } from "lucide-react";
import { STYLES } from "../../constants/styles";

const DashboardSidebar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className={`${STYLES.dark.background.primary}`}>
      {/* <nav className='fixed top-0 z-50'>
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
            </div>
          </div>
        </div>
      </nav > */}

      <Sidebar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />

      <div className={`p-4 sm:ml-64 mt-0 ${STYLES.dark.background.primary}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardSidebar;
