import * as React from 'react';
import useFetch from 'use-http';

import UnstyledLink from '../links/UnstyledLink';

export const SignUpForBetaForm = () => {
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const formRef = React.useRef<any>();
  const { post, response, loading, error } = useFetch('/register/beta');

  const _handleSubmit = async (e) => {
    e.preventDefault();

    const formdData = new FormData();
    formdData.append('name', name);
    formdData.append('contact', contact);
    formdData.append('type', 'Beta Signup');

    await post(formdData);
    if (response.ok) {
      alert('You have successfully submitted.');
      setName('');
      setContact('');
    }
  };

  return (
    <div className='overflow-hidden bg-white rounded-lg sm:max-w-md sm:w-full'>
      <div className='px-4 py-8 sm:px-10'>
        <div>
          <p className='text-sm font-medium text-dark'>Sign up for beta</p>
        </div>

        <div className='mt-6'>
          <form ref={formRef} className='space-y-6' onSubmit={_handleSubmit}>
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
                disabled={loading}
                className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-400 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                {loading ? 'sending...' : 'Notify me'}
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
  );
};
