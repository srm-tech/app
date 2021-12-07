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

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    saveData(data);
  };

  // const handleInputChange = e => {
  //   const target = e.target;
  //   const value = target.type === "checkbox" ? target.checked : target.value;
  // }

  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  async function loadData() {
    const loaded = await get('/api/me');
  }

  async function saveData(data) {
    const saved = await post('/api/me/change', data);
  }

  useEffect(() => {
    setLoaderVisible(loading);
    // setFormData({
    //   ...formData,
    //   firstName: data.firstName,
    // });
    // console.log("data", data);
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
                  <h3 className='text-lg font-medium leading-6'>Profile</h3>
                  <p className='mt-1 text-sm'>
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
              </div>

              {/* right panel */}
              <div className='p-4 mt-5 md:mt-0 md:col-span-2'>
                <LoadingOverlay active={loaderVisible} spinner>
                  {/* first name field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='firstName'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        First name:
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            type='text'
                            // name='firstName'
                            // id='firstName'
                            // autoComplete='firstName'
                            {...register('firstName', {
                              required: true,
                              maxLength: 127,
                            })}
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            // onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          />
                        </div>
                        {errors.firstName?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* first name field ends here */}

                  {/* last name field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='lastName'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Last name:
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            type='text'
                            {...register('lastName', {
                              required: true,
                              maxLength: 127,
                            })}
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            // onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          />
                        </div>
                        {errors.lastName?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* last name field ends here */}

                  {/* email field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Email:
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
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
                            // onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        {errors.email?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                        {errors.email?.type === 'pattern' && (
                          <small className='text-red-900'>
                            Email is invalid
                          </small>
                        )}
                        {/* {errors.email} */}
                      </div>
                    </div>
                  </div>
                  {/* email field ends here */}

                  {/* business name field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='businessName'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Business name:
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            type='text'
                            {...register('businessName', {
                              required: true,
                              maxLength: 255,
                            })}
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            // onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          />
                        </div>
                        {errors.businessName?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* business name field ends here */}

                  {/* business category field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='businessCategory'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Business category:
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            type='text'
                            {...register('businessCategory', {
                              required: true,
                              maxLength: 255,
                            })}
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            // onChange={(e) => setFormData({...formData, businessCategory: e.target.value})}
                          />
                          {errors.businessCategory?.type === 'required' && (
                            <small className='text-red-900'>
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* business category field ends here */}

                  {/* is guru field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='isGuru'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Am I Guru?
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            {...register('isGuru')}
                            type='checkbox'
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* business category field ends here */}

                  {/* is is business field starts */}
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='isGuru'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Am I Business?
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            {...register('isBusiness')}
                            type='checkbox'
                            className='flex-1 block min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* business category field ends here */}

                  <div className='pt-5'>
                    <div className='flex justify-end'>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                      >
                        Save
                      </button>
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
