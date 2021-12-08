import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingOverlay from 'react-loading-overlay';
import useFetch from 'use-http';

import DashboardLayout from '@/components/layouts/DashboardLayout';

interface IFormInput {
  commissionPerReceivedLeadCash: number;
  commissionPerCompletedLead: number;
  commissionPerReceivedLeadPercent: number;
  email: string;
  message: string;
}

export default function profile() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    commisionPerReceivedLeadCash: 0,
    commissionPerCompletedLead: 0,
    commissionPerReceivedLeadPercent: 0,
  });

  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    saveData(data);
  };

  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  useEffect(() => {
    async function loadData() {
      const loaded = await get('/api/business/defaultAgreement');
      setFormValues(loaded);
      reset(loaded);
    }
    loadData();
  }, [reset]);

  async function saveData(data) {
    console.log('sent', data);
    setSavedMessage(false);
    setErrorMessage(false);
    const saved = await post('/api/invitations/send', data);
    if (response.ok) {
      setSavedMessage(true);
    } else {
      console.log('saved:', saved);
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
                            Uh, oh! A problem occured while sending your email!
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
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Email address
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='text'
                              {...register('email', {
                                required: true,
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                },
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>

                          {errors.email?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                          {errors.email?.type === 'pattern' && (
                            <small className='text-red-900'>
                              The email is invalid
                            </small>
                          )}
                        </div>
                        {/* Email field ends here */}

                        {/* Commission per received lead field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='commissionPerReceivedLeadCash'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Commission per received lead ($):
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='number'
                              defaultValue={
                                formValues.commissionPerReceivedLeadCash
                              }
                              {...register('commissionPerReceivedLeadCash', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                          {errors.commissionPerReceivedLeadCash?.type ===
                            'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Commission per received lead field ends here */}

                        {/* Commission per completed lead field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='commissionPerCompletedLead'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Commission per completed lead ($):
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='number'
                              defaultValue={
                                formValues.commissionPerCompletedLead
                              }
                              {...register('commissionPerCompletedLead', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                          {errors.commissionPerCompletedLead?.type ===
                            'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Commission per completed lead field ends here */}

                        {/* Commission per received lead (%) field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='commissionPerReceivedLeadPercent'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Commission per received lead (%):
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='number'
                              defaultValue={
                                formValues.commissionPerReceivedLeadPercent
                              }
                              {...register('commissionPerReceivedLeadPercent', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                          {errors.commissionPerReceivedLeadPercent?.type ===
                            'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Commission per received lead (%) field ends here */}

                        {/* Message field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='message'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Message:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <textarea
                              {...register('message', {
                                required: true,
                                minLength: 1,
                                maxLength: 1023,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                          {errors.message?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Message field ends here */}
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