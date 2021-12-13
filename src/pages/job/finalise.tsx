import { UsersIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingOverlay from 'react-loading-overlay';
import useFetch from 'use-http';

import DashboardLayout from '@/components/layouts/DashboardLayout';

import { env } from '@/config';

interface IFormInput {
  revenue: number;
  reward: number;
  tip: number;
  total: number;
}

export default function profile() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    revenue: 0,
    reward: 0,
    tip: 0,
    total: 0,
  });

  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  function handleChange(e) {
    const data = e.target.form.elements;
    const revenue: number = isNaN(parseFloat(data[0].value))
      ? 0
      : parseFloat(data[0].value);
    const reward: number = isNaN(parseFloat(data[1].value))
      ? 0
      : parseFloat(data[1].value);
    const tip: number = isNaN(parseFloat(data[2].value))
      ? 0
      : parseFloat(data[2].value);
    const guruFee = (revenue + reward + tip) * env.TRANSACTION_FEE;
    const total = revenue + reward + tip + guruFee;
    data[3].value = guruFee.toFixed(2);
    data[4].value = total.toFixed(2);
  }
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    saveData(data);
  };

  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  useEffect(() => {
    async function loadData() {
      // const loaded = await get('/api/job/finalise', {
      // });
      // setFormValues(loaded);
      // reset(loaded);
      // setFormValues();
    }
    // loadData();
  }, [reset]);

  async function saveData(data) {
    setSavedMessage(false);
    setErrorMessage(false);
    // const saved = await post('/api/me/change', data);
  }

  //   if (response.ok) {
  //     setSavedMessage(true);
  //   } else {
  //     setErrorMessage(true);
  //   }
  // }

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  return (
    <>
      <DashboardLayout>
        <form
          method='post'
          onSubmit={handleSubmit(onSubmit)}
          onChange={(e) => handleChange(e)}
        >
          <div className='user-form'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              {/* left panel */}
              <div className='p-4 text-white bg-green-800 md:col-span-1'>
                <div className='px-4 sm:px-0'>
                  <h1 className='text-lg font-medium leading-6'>Review job</h1>
                  <p className='mt-1 text-sm'></p>
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
                        {/* Guru */}
                        <div className='flex p-2 mt-1 rounded-md shadow-md sm:col-span-4'>
                          <small>Guru:</small>
                        </div>

                        {/* Guru ends here */}

                        {/* Revenue field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='revenue'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Revenue:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='number'
                              step='0.01'
                              {...register('revenue', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>

                          {errors.revenue?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Revenue field ends here */}

                        {/* Reward field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='revenue'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Reward:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='number'
                              step='0.01'
                              {...register('reward', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>

                          {errors.reward?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Reward field ends here */}

                        {/* Tip / bonus field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='revenue'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Tip / bonus:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              type='number'
                              step='0.01'
                              {...register('tip', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>

                          {errors.tip?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Tip / bonus field ends here */}

                        {/* Guru fees field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='guruFee'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Introduce.guru fee:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              disabled={true}
                              defaultValue={0}
                              type='number'
                              step='0.01'
                              {...register('guruFee', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>

                          {errors.guruFee?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Tip / bonus field ends here */}

                        {/* Total field starts here */}
                        <div className='sm:col-span-4'>
                          <label
                            htmlFor='revenue'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Total payment:
                          </label>
                          <div className='flex mt-1 rounded-md shadow-sm'>
                            <input
                              disabled={true}
                              type='number'
                              {...register('total', {
                                required: true,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>

                          {errors.tip?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                        {/* Total field ends here */}
                      </div>
                      <div className='pt-5'>
                        <div className='flex justify-end'>
                          <button
                            type='submit'
                            className='inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          >
                            Confirm
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
