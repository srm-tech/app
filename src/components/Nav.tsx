import { Popover, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Fragment } from 'react';

import { env } from '@/lib/envConfig';

import Logo from './Logo';

export default function Nav() {
  const { data: session } = useSession();
  const router = useRouter();

  const navigation = [
    { name: 'Early Bird Offer', href: '/promotion' },

    // { name: 'Marketplace', href: '#' },
    // { name: 'Company', href: '#' },
  ];
  if (session) {
    navigation.push({ name: 'My Introductions', href: '/app/introductions' });
  }
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
        <div className='flex items-center hidden md:flex'>
          <div className='hidden space-x-10 mr-14 md:flex'>
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
          <button
            onClick={
              session
                ? () => {
                    signOut({ callbackUrl: env.BASE_URL });
                  }
                : () =>
                    signIn('', {
                      callbackUrl: location.href,
                    })
            }
            className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700'
          >
            {session ? 'Log out' : 'Log in'}
          </button>
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
              Log in
            </a> */}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
