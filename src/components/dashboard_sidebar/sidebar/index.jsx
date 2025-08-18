import { CheckCircleIcon, LayoutDashboardIcon, PenSquareIcon, SaveAllIcon, UserPenIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { STYLES } from "../../../constants/styles"
import { useState } from "react";

export const Sidebar = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const iconStyle = 'shrink-0 w-5 h-5 transition duration-75';
  const linkStyle = 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group';
  const spanStyle = 'flex-1 ms-3 whitespace-nowrap';
  const [activeLink, setActiveLink] = useState('Dashboard');
  const [DASHBOARD, USER_REVIEW, CONFIG_USERS, USER_MAN, EXPORT_DATA] = [
    "Dashboard",
    "User Reviews",
    "Configure Users",
    "User Management",
    "Export Data"
  ];

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
              onClick={() => {
                setIsSideBarOpen(false)
                setActiveLink(DASHBOARD)
              }}
              to='/'
              className={linkStyle}
            >
              <LayoutDashboardIcon color={activeLink === DASHBOARD ? STYLES.dark.accent.color : "grey"} className={iconStyle} />
              <span className={spanStyle}>{DASHBOARD}</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setIsSideBarOpen(false)
                setActiveLink(USER_REVIEW)
              }}
              to='/'
              className={linkStyle}
            >
              <CheckCircleIcon color={activeLink === USER_REVIEW ? STYLES.dark.accent.color : "grey"} className={iconStyle} />
              <span className={spanStyle}>{USER_REVIEW}</span>
            </Link>
          </li>
          <li>
            <Link
              to='/cv-link'
              onClick={() => {
                setIsSideBarOpen(false)
                setActiveLink(CONFIG_USERS)
              }}
              className={linkStyle}
            >
              <PenSquareIcon color={activeLink === CONFIG_USERS ? STYLES.dark.accent.color : "grey"} className={iconStyle} />
              <span className={spanStyle}>{CONFIG_USERS}</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setIsSideBarOpen(false)
                setActiveLink(USER_MAN)
              }}
              to='/'
              className={linkStyle}
            >
              <UserPenIcon color={activeLink === USER_MAN ? STYLES.dark.accent.color : "grey"} className={iconStyle} />
              <span className={spanStyle}>{USER_MAN}</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setIsSideBarOpen(false)
                setActiveLink(EXPORT_DATA)
              }}
              to='/'
              className={linkStyle}
            >
              <SaveAllIcon color={activeLink === EXPORT_DATA ? STYLES.dark.accent.color : "grey"} className={iconStyle} />
              <span className={spanStyle}>{EXPORT_DATA}</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}