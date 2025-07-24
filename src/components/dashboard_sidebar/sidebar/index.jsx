import { CheckCircleIcon, LayoutDashboardIcon, PenSquareIcon, SaveAllIcon, UserPenIcon } from "lucide-react"
import { Link } from "react-router-dom"

export const Sidebar = ({ isSideBarOpen, setIsSideBarOpen }) => {

  return (<aside
    id='logo-sidebar'
    className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 ${isSideBarOpen ? "" : "sm:translate-x-0 transition-transform -translate-x-full"} dark:bg-gray-800 dark:border-gray-700`}
    aria-label='Sidebar'
  >
    <div className='h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800'>
      <ul className='space-y-2 font-medium'>
        <li>
          <Link
            onClick={() => { setIsSideBarOpen(false) }}
            to='/'
            className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
          >
            <LayoutDashboardIcon className='shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
            <span className='flex-1 ms-3 whitespace-nowrap'>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            onClick={() => { setIsSideBarOpen(false) }}
            to='/'
            className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
          >
            <CheckCircleIcon className='shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
            <span className='flex-1 ms-3 whitespace-nowrap'>User Reviews</span>
          </Link>
        </li>
        <li>
          <Link
            to='/cv-link'
            onClick={() => { setIsSideBarOpen(false) }}
            className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
          >
            <PenSquareIcon className='shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
            <span className='flex-1 ms-3 whitespace-nowrap'>Configure Users</span>
          </Link>
        </li>
        <li>
          <Link
            onClick={() => { setIsSideBarOpen(false) }}
            to='/'
            className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
          >
            <UserPenIcon className='shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
            <span className='flex-1 ms-3 whitespace-nowrap'>User Management</span>
          </Link>
        </li>
        <li>
          <Link
            onClick={() => { setIsSideBarOpen(false) }}
            to='/'
            className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
          >
            <SaveAllIcon className='shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
            <span className='flex-1 ms-3 whitespace-nowrap'>Export Data</span>
          </Link>
        </li>
      </ul>
    </div>
  </aside>)
}