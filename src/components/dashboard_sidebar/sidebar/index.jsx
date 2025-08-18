import { CheckCircleIcon, LayoutDashboardIcon, PenSquareIcon, SaveAllIcon, UserPenIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { STYLES } from "../../../constants/styles"

export const Sidebar = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const iconStyle = 'shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white';
  const linkStyle = 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group';
  const spanStyle = 'flex-1 ms-3 whitespace-nowrap';

  return (
    <aside
      id='logo-sidebar'
      className={`
        fixed top-0 left-0 z-40 w-content pr-6 h-screen m-auto border-r 
        ${isSideBarOpen ?
          "" :
          "sm:translate-x-0 transition-transform -translate-x-full"} ${STYLES.dark.background["sidebar-gradient"]} ${STYLES.dark.border.medium}`}
      aria-label='Sidebar'
    >
      <div className='flex h-full px-3 pb-4 overflow-y-auto items-center justify-start'>
        <ul className='space-y-2 font-medium'>
          <li>
            <Link
              onClick={() => { setIsSideBarOpen(false) }}
              to='/'
              className={linkStyle}
            >
              <LayoutDashboardIcon className={iconStyle} />
              <span className={spanStyle}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => { setIsSideBarOpen(false) }}
              to='/'
              className={linkStyle}
            >
              <CheckCircleIcon className={iconStyle} />
              <span className={spanStyle}>User Reviews</span>
            </Link>
          </li>
          <li>
            <Link
              to='/cv-link'
              onClick={() => { setIsSideBarOpen(false) }}
              className={linkStyle}
            >
              <PenSquareIcon className={iconStyle} />
              <span className={spanStyle}>Configure Users</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => { setIsSideBarOpen(false) }}
              to='/'
              className={linkStyle}
            >
              <UserPenIcon className={iconStyle} />
              <span className={spanStyle}>User Management</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => { setIsSideBarOpen(false) }}
              to='/'
              className={linkStyle}
            >
              <SaveAllIcon className={iconStyle} />
              <span className={spanStyle}>Export Data</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}