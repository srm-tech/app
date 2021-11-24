import * as React from 'react';
import useFetch from 'use-http';
import ContactType from './ContactTypeSelect';
import ComboSelect from '../ComboSelect';
import { useSession, signIn } from 'next-auth/react';

interface Item {
  label: string;
  value: string;
}

export const QuickForm = () => {
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [businessName, setBusinessName] = React.useState<null | Item>(null);
  const [contactType, setContactType] = React.useState('phone');
  const { data: session } = useSession();
  const formRef = React.useRef<any>();
  const { post, response, loading, error } = useFetch('/introductions');

  const _handleSubmit = async (e) => {
    e.preventDefault();

    const formdData = new FormData();
    formdData.append('name', name);
    formdData.append('contact', contact);
    formdData.append('businessName', businessName?.value || '');
    formdData.append('type', 'Beta Signup');

    await post(formdData);
    if (response.ok) {
      alert('You have successfully submitted.');
      setName('');
      setContact('');
    }
  };

  return (
    <div className='bg-white rounded-lg sm:max-w-md sm:w-full'>
      <form ref={formRef} className='space-y-6' onSubmit={_handleSubmit}>
        <div className='flex flex-col'>
          <div className='px-8 pt-4'>
            <label className='text-base font-medium text-gray-900'>
              Quick Introduction
            </label>
          </div>{' '}
          <div className='flex px-8 py-4'>
            <img
              src='/home/img/introduceTo.svg'
              alt='introducing'
              className='w-20 h-20 mr-2'
            />
            <div className='flex-1'>
              <p className='text-sm leading-5 text-gray-500'>
                Introducing trusted partner:
              </p>
              <label htmlFor='name' className='sr-only'>
                Contact list
              </label>
              <ComboSelect onSelect={(value) => setBusinessName(value)} />
            </div>
          </div>
          <hr />
          <div className='flex px-8 py-4'>
            <div className='flex-1 space-y-2'>
              <div className=''>
                <p className='text-sm leading-5 text-gray-500'>To client:</p>
                <label htmlFor='name' className='sr-only'>
                  Introduce to (name)
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  autoComplete='name'
                  placeholder='Joe Doe'
                  required
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className='flex'>
                <ContactType onChange={setContactType} value={contactType} />
                <input
                  type='text'
                  name='contact'
                  id='contact'
                  autoComplete='contact'
                  placeholder={
                    contactType === 'email' ? 'contact email' : 'contact phone'
                  }
                  required
                  className='ml-3  block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                />
              </div>
            </div>
            <img
              src='/home/img/introducing.svg'
              alt='introducing'
              className='w-20 h-20 mt-4'
            />
          </div>
          <div className='px-8 py-4'>
            <button
              type='submit'
              disabled={loading}
              className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-400 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              {loading ? 'sending...' : 'Introduce'}
            </button>
          </div>
          {!session && (
            <div className='px-4 py-6 border-t-2 sm:px-10'>
              <p className='text-xs leading-5 text-gray-500'>
                <button
                  onClick={() => signIn()}
                  className='font-medium text-blue-500 hover:underline'
                >
                  Login
                </button>{' '}
                to save and track introductions.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
