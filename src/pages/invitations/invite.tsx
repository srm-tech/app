import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingOverlay from 'react-loading-overlay';
import useFetch from 'use-http';

import DashboardLayout from '@/components/layouts/DashboardLayout';

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessCategory: string;
  isGuru: boolean;
  isBusiness: boolean;
}

export default function profile() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    businessCategory: '',
    isGuru: false,
    isBusiness: false,
  });

  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    saveData(data);
  };

  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  useEffect(() => {
    async function loadData() {
      const loaded = await get('/api/me');
      setFormValues(loaded);
    }
    loadData();
  }, []);

  async function saveData(data) {
    const saved = await post('/api/me/change', data);
    if (response.ok) {
      setSavedMessage(true);
    } else {
      setErrorMessage(true);
    }
  }

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  return (
    <>
      <DashboardLayout>
        <form method='post' onSubmit={handleSubmit(onSubmit)}>
          <div className='user-form'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              {/* left panel */}
              <div className='p-4 text-white bg-green-800 md:col-span-1'>
                <div className='px-4 sm:px-0'>
                  <h1 className='text-lg font-medium leading-6'>
                    Invite guru to join the platform
                  </h1>
                  <p className='mt-1 text-sm'>
                    Review your default agreement, edit it – if you need to –
                    and send it out with your invitation
                  </p>
                </div>
              </div>

              {/* right panel */}
              <div className='p-4 mt-5 md:mt-0 md:col-span-2'>
                {/* error message */}
                {errorMessage && (
                  <div className='relative bg-red-100'>
                    <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                      <div className='pr-16 sm:text-center sm:px-16'>
                        <p className='font-medium text-red-400'>
                          <span>
                            Uh, oh! A problem occured during saving your data!
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of error message */}
                {/* ok message */}
                {savedMessage && (
                  <div className='relative bg-green-800'>
                    <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                      <div className='pr-16 sm:text-center sm:px-16'>
                        <p className='font-medium text-white'>
                          <span>Your invitation has been sent</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of ok message */}

                <LoadingOverlay active={loaderVisible} spinner>
                  <div className='space-y-8 divide-y divide-gray-200'>
                    <div>
                      <div className='grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6'>
                        {/* Email field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Email address
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='text'
                              name='username'
                              id='username'
                              autoComplete='username'
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                        {/* Email field ends here */}

                        {/* Commission per received lead field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Commission per received lead ($):
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='text'
                              name='username'
                              id='username'
                              autoComplete='username'
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                        {/* Commission per received lead field ends here */}

                        {/* Commission per completed lead field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Commission per completed lead ($):
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='text'
                              name='username'
                              id='username'
                              autoComplete='username'
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                        {/* Commission per completed lead field ends here */}

                        {/* Commission per received lead (%) field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Commission per received lead (%):
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='text'
                              name='username'
                              id='username'
                              autoComplete='username'
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                        {/* Commission per received lead (%) field ends here */}

                        {/* Message) field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Message:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <textarea
                              name='username'
                              id='username'
                              autoComplete='username'
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                        {/* Messave per received lead (%) field ends here */}
                      </div>

                      <div className='pt-5'>
                        <div className='flex justify-end'>
                          <button
                            type='submit'
                            className='inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          >
                            Invite
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </LoadingOverlay>
              </div>
              {/* right panel ends here */}
            </div>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}
