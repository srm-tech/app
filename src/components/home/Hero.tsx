import { ClockIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Link from 'next/link';
import UnstyledLink from '../links/UnstyledLink';

const scriptURL =
  'https://hook.integromat.com/ndb1abbohl44oi2xsn23lhb7a1pvh3n5';

export default function Hero() {
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const formRef = React.useRef<any>();

  const _handleSubmit = (e) => {
    e.preventDefault();

    const formdData = new FormData();
    formdData.append('name', name);
    formdData.append('contact', contact);
    formdData.append('type', 'Beta Signup');

    fetch(scriptURL, {
      method: 'POST',
      body: formdData,
    }).then(() => {
      alert('You have successfully submitted.');
      setName('');
      setContact('');
    });
    // .catch(error => )
  };

  return (
    <section className='mt-16 mb-16 sm:mt-24'>
      <div className='mx-auto max-w-7xl'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          <div className='px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center'>
            <div>
              <Link href='/#roadmap' passHref>
                <a className='inline-flex items-center p-1 pr-2 text-white bg-gray-900 rounded-full sm:text-base lg:text-sm xl:text-base hover:text-gray-200'>
                  <span className='px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-primary-400 rounded-full'>
                    Beta
                  </span>
                  <span className='ml-4 text-sm'>Coming soon</span>
                  <ClockIcon
                    className='w-5 h-5 ml-2 text-gray-500'
                    aria-hidden='true'
                  />
                </a>
              </Link>
              <h1 className='mt-4 text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl'>
                <span className='md:block'>Your success</span>{' '}
                <span className='text-dark-green md:block'>
                  powered by a referral network
                </span>
              </h1>
              <p className='mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl'>
                Digital marketing and advertising became very expensive. With
                Introduce Guru, you can incentivise trusted partners with
                referral fees and grow your business with $0 marketing costs.
              </p>
              {/* <p className='mt-8 text-sm font-semibold tracking-wide text-white uppercase sm:mt-10'>
                Supported by
              </p>
              <div className='w-full mt-5 sm:mx-auto sm:max-w-lg lg:ml-0'>
                <div className='flex flex-wrap items-start justify-between'>
                  <div className='flex justify-center px-1'>
                    <img
                      className='h-9 sm:h-10 opacity-70'
                      src='/home/testimonials/personal-painters.png'
                      alt='Tuple'
                    />
                  </div>
                  <div className='flex justify-center px-1'>
                    <img
                      className='h-9 sm:h-10'
                      src='https://tailwindui.com/img/logos/workcation-logo-gray-400.svg'
                      alt='Workcation'
                    />
                  </div>
                  <div className='flex justify-center px-1'>
                    <img
                      className='h-9 sm:h-10'
                      src='https://tailwindui.com/img/logos/statickit-logo-gray-400.svg'
                      alt='StaticKit'
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className='mx-5 mt-16 sm:mt-24 lg:mt-0 lg:col-span-6'>
            <div className='overflow-hidden bg-white rounded-lg sm:max-w-md sm:w-full sm:mx-auto'>
              <div className='px-4 py-8 sm:px-10'>
                <div>
                  <p className='text-sm font-medium text-dark'>
                    Sign up for beta
                  </p>
                </div>

                <div className='mt-6'>
                  <form
                    ref={formRef}
                    className='space-y-6'
                    onSubmit={_handleSubmit}
                  >
                    <div>
                      <label htmlFor='name' className='sr-only'>
                        Full name
                      </label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        autoComplete='name'
                        placeholder='Name'
                        required
                        className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor='mobile-or-email' className='sr-only'>
                        Mobile number or email
                      </label>
                      <input
                        type='text'
                        name='mobile-or-email'
                        id='mobile-or-email'
                        autoComplete='email'
                        placeholder='Mobile number or email'
                        required
                        className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        value={contact}
                        onChange={(event) => setContact(event.target.value)}
                      />
                    </div>

                    <div>
                      <button
                        type='submit'
                        className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-400 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                      >
                        Notify me
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className='px-4 py-6 border-t-2 border-gray-200 bg-gray-50 sm:px-10'>
                <p className='text-xs leading-5 text-gray-500'>
                  By signing up, you agree to our{' '}
                  <UnstyledLink
                    href='/legal/terms'
                    className='font-medium text-gray-900 hover:underline'
                  >
                    Terms
                  </UnstyledLink>
                  ,{' '}
                  <UnstyledLink
                    href='/legal/privacy'
                    className='font-medium text-gray-900 hover:underline'
                  >
                    Data Policy
                  </UnstyledLink>{' '}
                  and{' '}
                  <UnstyledLink
                    href='/legal/privacy'
                    className='font-medium text-gray-900 hover:underline'
                  >
                    Cookies Policy
                  </UnstyledLink>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
