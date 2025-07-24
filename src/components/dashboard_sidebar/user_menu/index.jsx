import { useState } from "react";

export const UserMenu = () => {
  const [isUserDropDownOpen, setIsUserDropDownOpen] = useState(false);

  return (
    <div className='flex items-center'>
      <div className='flex items-center ms-3'>
        <div>
          <button
            type='button'
            className='flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
            onClick={() => { setIsUserDropDownOpen(!isUserDropDownOpen) }}
          >
            <span className='sr-only'>Open user menu</span>
            <img
              className='w-8 h-8 rounded-full'
              src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
              alt='user'
            />
          </button>
        </div>
        {
          (
            <div
              className={`z-50 top-10 right-0 ${isUserDropDownOpen ? 'absolute' : 'hidden'} my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600 p-4 rounded-bl-2xl`}
              id='dropdown-user'
            >
              <div className='px-4 py-3 pt-1' role='none'>
                <p
                  className='text-sm text-gray-900 dark:text-white'
                  role='none'
                >
                  Neil Sims
                </p>
                <p
                  className='text-sm font-medium text-gray-900 truncate dark:text-gray-300'
                  role='none'
                >
                  neil.sims@ARSKIPOS.com
                </p>
              </div>
              <ul className='py-1' role='none'>
                <li>
                  <a
                    href='/'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    role='menuitem'
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href='/'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    role='menuitem'
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href='/'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    role='menuitem'
                  >
                    Earnings
                  </a>
                </li>
                <li>
                  <a
                    href='/'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    role='menuitem'
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )
        }
      </div>
    </div>
  )
}