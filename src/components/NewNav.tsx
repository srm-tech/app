import { Popover, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';

const navigation = [
  { name: 'Contact Us', href: '#' },
  // { name: 'Marketplace', href: '#' },
  // { name: 'Company', href: '#' },
];

export default function NewNav() {
  return (
    <Popover>
      <nav
        className='relative flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6'
        aria-label='Global'
      >
        <div className='flex items-center flex-1'>
          <div className='flex items-center justify-between w-full md:w-auto'>
            <a href='#'>
              <span className='sr-only'>Workflow</span>
              <img
                src='/logo/logo_submark_light.svg'
                className='w-10 h-10'
                alt='logo'
              />
            </a>
            <div className='flex items-center -mr-2 md:hidden'>
              <Popover.Button className='inline-flex items-center justify-center p-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200'>
                <span className='sr-only'>Open main menu</span>
                <MenuIcon className='w-6 h-6' aria-hidden='true' />
              </Popover.Button>
            </div>
          </div>
        </div>
        <div className='flex items-center hidden md:flex'>
          <div className='hidden space-x-10 mr-14 md:flex'>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='font-medium text-gray-700 transition hover:text-gray-400'
              >
                {item.name}
              </a>
            ))}
          </div>
          <a
            href='#'
            // className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700'
            className='inline-flex items-center px-4 py-2 text-lg text-white border border-transparent rounded-md shadow-sm bg-dark-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600'
          >
            Log in
          </a>
        </div>
      </nav>

      <Transition
        as={Fragment}
        enter='duration-150 ease-out'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='duration-100 ease-in'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Popover.Panel
          focus
          className='absolute inset-x-0 top-0 z-10 p-2 transition origin-top-right transform md:hidden'
        >
          <div className='overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5'>
            <div className='flex items-center justify-between px-5 pt-4'>
              <div>
                <img
                  className='w-auto h-8'
                  src='https://tailwindui.com/img/logos/workflow-mark-green-600.svg'
                  alt=''
                />
              </div>
              <div className='-mr-2'>
                <Popover.Button className='inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300'>
                  <span className='sr-only'>Close menu</span>
                  <XIcon className='w-6 h-6' aria-hidden='true' />
                </Popover.Button>
              </div>
            </div>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50'
                >
                  {item.name}
                </a>
              ))}
            </div>
            <a
              href='#'
              className='block w-full px-5 py-3 text-lg font-medium text-center text-gray-700 bg-gray-100 hover:bg-gray-100'
            >
              Log in
            </a>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
