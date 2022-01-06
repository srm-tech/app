import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/solid';
import React, { FC, Fragment, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

import Logo from '../Logo';
import Avatar from '../Avatar';
import useFetch, { CachePolicies } from 'use-http';

const navigation = [
  // { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  {
    name: 'Introductions',
    href: '/introductions',
    icon: InboxIcon,
    current: false,
  },
  // {
  //   name: 'Invitations',
  //   href: '/invitations',
  //   icon: InboxIcon,
  //   current: false,
  // },
  { name: 'My Contacts', href: '/myContacts', icon: UsersIcon, current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '/users/profile' },
  // { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout({
  children,
  title,
}: {
  children: any;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const {
    loading,
    error,
    data: user = [],
  } = useFetch('/me', { cachePolicy: CachePolicies.CACHE_ONLY }, []);

  const activeNavigation = navigation.map((item) => {
    item.current = false;
    if (item.href === router.pathname) {
      item.current = true;
    }
    return item;
  });
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-40 flex md:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <div className='relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-dark'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-0 right-0 pt-2 -mr-12'>
                    <button
                      type='button'
                      className='flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className='sr-only'>Close sidebar</span>
                      <XIcon
                        className='w-6 h-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className='flex items-center flex-shrink-0 px-4'>
                  <Logo basePath='/' />
                </div>
                <div className='flex-1 h-0 mt-5 overflow-y-auto'>
                  <nav className='px-2 space-y-1'>
                    {activeNavigation.map((item) => (
                      <Link href={item.href} passHref key={item.href}>
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-green-800 text-white'
                              : 'text-indigo-100 hover:bg-green-600',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                        >
                          <item.icon
                            className='flex-shrink-0 w-6 h-6 mr-4 text-dark-green'
                            aria-hidden='true'
                          />
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className='flex-shrink-0 w-14' aria-hidden='true'>
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex flex-col flex-grow pt-5 overflow-y-auto bg-dark'>
            <div className='flex items-center flex-shrink-0 px-4'>
              <Logo basePath='/' small />
            </div>
            <div className='flex flex-col flex-1 mt-5'>
              <nav className='flex-1 px-2 pb-4 space-y-1'>
                {navigation.map((item) => (
                  <Link href={item.href} passHref key={item.href}>
                    <a
                      key={item.name}
                      className={classNames(
                        item.current
                          ? 'bg-green-800 text-white'
                          : 'text-indigo-100 hover:bg-green-600',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className='flex-shrink-0 w-6 h-6 mr-3 text-dark-green'
                        aria-hidden='true'
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 md:pl-64'>
          <div className='sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white shadow'>
            <button
              type='button'
              className='px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <MenuAlt2Icon className='w-6 h-6' aria-hidden='true' />
            </button>
            <div className='flex justify-between flex-1 px-8'>
              <div className='flex flex-1'>
                <form
                  className='flex w-full md:ml-0'
                  action='#'
                  method='GET'
                  id='search-form'
                >
                  <label htmlFor='search-field' className='sr-only'>
                    Search
                  </label>
                  <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
                    <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
                      <SearchIcon className='w-5 h-5' aria-hidden='true' />
                    </div>
                    <input
                      id='search-field'
                      className='block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm'
                      placeholder='Search'
                      type='search'
                      name='search'
                    />
                  </div>
                </form>
              </div>
              <div className='flex items-center ml-4 md:ml-6'>
                <button
                  type='button'
                  className='p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  <span className='sr-only'>View notifications</span>
                  <BellIcon className='w-6 h-6' aria-hidden='true' />
                </button>

                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-3'>
                  <div>
                    <Menu.Button className='flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                      <span className='sr-only'>Open user menu</span>
                      <Avatar
                        size='small'
                        text={
                          user &&
                          `${user?.firstName?.charAt(0) || ' '}
                        `
                        }
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link href={item.href} passHref>
                              <a
                                onClick={(e) => {
                                  debugger;
                                  if (item.name === 'Sign out') {
                                    e.preventDefault();
                                    signOut();
                                    router.push('/');
                                  }
                                }}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main>
            <div className='py-6'>
              <div className='px-4 mx-auto max-w-7xl sm:px-6 md:px-8'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {title}
                </h1>
              </div>
              <div className='px-4 mx-auto max-w-7xl sm:px-6 md:px-8'>
                {/* Replace with your content */}
                <div className='py-4'>
                  <div className='p-2 border-4 border-gray-200 rounded-lg overflow-y-auto'>
                    {children}
                  </div>
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
