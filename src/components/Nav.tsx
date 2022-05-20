import { Popover } from '@headlessui/react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';

import { env } from '@/lib/envConfig';
import { classNames } from '@/lib/helper';

import Modal from '@/components/modals/ConfirmModal';

import { useSession } from '@/features/session/SessionContext';
import RegisterForm from '@/features/userProfile/RegisterForm';
import userProfileStore from '@/features/userProfile/userStore';

import Avatar from './Avatar';
import Logo from './Logo';

export default function Nav() {
  const session = useSession();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const userProfile = userProfileStore((state) => state.userProfile);

  const navigation: { name: string; href: string }[] = [
    // { name: 'Marketplace', href: '#' },
    // { name: 'Company', href: '#' },
  ];
  if (session.isActive) {
    // navigation.push({ name: 'Contacts', href: '/app/introductions' });
    navigation.push({ name: 'Introductions', href: '/app/introductions' });
  }
  const userNavigation = [
    { name: 'My Profile', href: '/app/users/profile' },
    // { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ];

  return (
    <Popover className='mx-auto max-w-7xl'>
      <nav
        className='relative flex items-center justify-between'
        aria-label='Global'
      >
        <div className='flex items-center flex-1'>
          <div className='flex items-center justify-between w-full md:w-auto'>
            <Logo />
            <div className='flex items-center -mr-2 md:hidden'>
              <Popover.Button className='inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white'>
                <span className='sr-only'>Open main menu</span>
                <MenuIcon className='w-6 h-6' aria-hidden='true' />
              </Popover.Button>
            </div>
          </div>
        </div>
        <div className='flex items-center md:flex space-x-6'>
          <div className='hidden  md:flex'>
            {navigation.map((item) => (
              <Link href={item.href} passHref key={item.name}>
                <a
                  key={item.name}
                  className='font-medium text-white hover:text-gray-300 '
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
          {/* Profile dropdown */}
          {session.isActive && (
            <Menu as='div' className='relative ml-3'>
              <div>
                <Menu.Button className='flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                  <span className='sr-only'>Open user menu</span>
                  <Avatar
                    size='small'
                    text={`${userProfile?.firstName?.charAt(0) || 'G'}
                        `}
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
                            onClick={async (e) => {
                              if (item.name === 'Sign out') {
                                e.preventDefault();
                                session.signOut({
                                  callbackUrl: env.BASE_URL,
                                });
                              }
                              if (item.name === 'My Profile') {
                                e.preventDefault();
                                setShowProfile(true);
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
          )}
          {!session.isActive && (
            <button
              onClick={
                session.isActive
                  ? () => {
                      session.signOut({ callbackUrl: env.BASE_URL });
                    }
                  : () => {
                      session.showLoginModal();
                    }
                // session.signIn('', {
                //   callbackUrl: location.href,
                // })
              }
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700'
            >
              {session.isActive ? 'Sign out' : 'Sign in'}
            </button>
          )}
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
                <Popover.Button className='inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500'>
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
                  className='block px-3 py-2 text-base font-medium text-dark rounded-md hover:text-gray-900 hover:bg-gray-50'
                >
                  {item.name}
                </a>
              ))}
            </div>
            {/* <a
              href='#'
              className='block w-full px-5 py-3 font-medium text-center text-green-600 bg-gray-50 hover:bg-gray-100'
            >
              Sign in
            </a> */}
          </div>
        </Popover.Panel>
      </Transition>

      <Modal
        isShowing={showProfile}
        form='profile'
        acceptCaption='Update'
        cancelCaption='Close'
        onAccept={() => console.info('Saving...')}
        onCancel={() => setShowProfile(false)}
        caption='My profile'
        content={
          <div>
            <RegisterForm
              id='profile'
              onSuccess={(data) => {
                toast.success(`Your profile is now up to date!`);
                userProfileStore.setState({ userProfile: data });
                setShowProfile(false);
              }}
            />
          </div>
        }
      />
    </Popover>
  );
}
