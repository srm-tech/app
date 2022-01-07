import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import countryList from 'react-select-country-list';
import useFetch from 'use-http';

import DashboardLayout from '@/layouts/DashboardLayout';
import { env } from '@/lib/envConfig';

interface IFormInput {
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string;
  businessCategory: string;
  stripeId: string;
  address1: string;
  address2: string;
  address3: string;
  abn: string;
  country: string;
  commissionType: string;
  commissionValue: number;
}

export default function Profile() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    contactEmail: '',
    contactPhone: '',
    businessName: '',
    businessCategory: '',
    stripeId: '',
    address1: '',
    address2: '',
    address3: '',
    abn: '',
    country: '',
    commissionType: '',
    commissionValue: 0,
  });
  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const countryOptions = useMemo(() => countryList().getData(), []);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    saveData(data);
  };

  const { get, post, response, loading, error } = useFetch(env.BASE_URL);

  useEffect(() => {
    async function loadData() {
      const loaded = await get('/api/me');
      if (loaded.agreement) {
        loaded.commissionType = loaded.agreement.commissionType;
        loaded.commissionValue = loaded.agreement.commissionValue;
      }
      setFormValues(loaded);
      reset(loaded);
    }
    loadData();
  }, [reset]);

  async function saveData(data) {
    setSavedMessage(false);
    setErrorMessage(false);
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
      <DashboardLayout title='My Profile' loading={loading}>
        <form method='post' onSubmit={handleSubmit(onSubmit)}>
          <div className='user-form'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
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
                          <span>
                            Your profile has been changed successfully
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of ok message */}

                <div>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    Personal Information
                  </h3>
                  <p className='max-w-2xl mt-1 text-sm text-gray-500'>
                    Use a permanent address where you can receive mail.
                  </p>
                </div>

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
                          defaultValue={formValues.firstName}
                          {...register('firstName', {
                            required: true,
                            maxLength: 127,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
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
                          defaultValue={formValues.lastName}
                          {...register('lastName', {
                            required: true,
                            maxLength: 127,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
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
                      htmlFor='contactEmail'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Contact email:
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <div className='flex max-w-lg rounded-md shadow-sm'>
                        <input
                          type='text'
                          defaultValue={formValues.contactPhone}
                          {...register('email', {
                            required: false,
                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        />
                      </div>
                      {errors.contactEmail?.type === 'required' && (
                        <small className='text-red-900'>
                          This field is required
                        </small>
                      )}
                      {errors.contactEmail?.type === 'pattern' && (
                        <small className='text-red-900'>
                          The email is invalid
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* email field ends here */}

                {/* phone field starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='contactPhone'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Contact phone:
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <div className='flex max-w-lg rounded-md shadow-sm'>
                        <input
                          type='text'
                          defaultValue={formValues.contactPhone}
                          {...register('contactPhone', {
                            required: false,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        />
                      </div>
                      {errors.contactPhone?.type === 'required' && (
                        <small className='text-red-900'>
                          This field is required
                        </small>
                      )}
                      {errors.contactPhone?.type === 'pattern' && (
                        <small className='text-red-900'>
                          The phone is invalid
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* phone field ends here */}

                <div className='pt-8 space-y-6 divide-y divide-gray-200 sm:pt-10 sm:space-y-5'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    Business Information
                  </h3>
                </div>

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
                          defaultValue={formValues.businessName}
                          {...register('businessName', {
                            required: true,
                            maxLength: 255,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
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
                          defaultValue={formValues.businessCategory}
                          {...register('businessCategory', {
                            required: true,
                            maxLength: 255,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
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

                {/* address line 1 starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='address1'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Address:
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <div className='flex max-w-lg rounded-md shadow-sm'>
                        <input
                          type='text'
                          defaultValue={formValues.address1}
                          {...register('address1', {
                            required: true,
                            maxLength: 255,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        />
                        {errors.address1?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* address line 1 ends here */}

                {/* address line 2 starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='address2'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Address (line 2):
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <div className='flex max-w-lg rounded-md shadow-sm'>
                        <input
                          type='text'
                          defaultValue={formValues.address1}
                          {...register('address2', {
                            maxLength: 255,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* address line 2 ends here */}

                {/* address line 3 starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='address3'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Address (line 3):
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <div className='flex max-w-lg rounded-md shadow-sm'>
                        <input
                          type='text'
                          defaultValue={formValues.address1}
                          {...register('address3', {
                            maxLength: 255,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* address line 3 ends here */}

                {/* ABN tax starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='abn'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      ABN:
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <div className='flex max-w-lg rounded-md shadow-sm'>
                        <input
                          type='text'
                          maxLength={11}
                          minLength={11}
                          defaultValue={formValues.abn}
                          {...register('abn', {
                            minLength: 11,
                            maxLength: 11,
                            required: true,
                          })}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        />
                      </div>
                    </div>
                  </div>
                  {errors.abn?.type === 'required' && (
                    <small className='text-red-900'>
                      This field is required
                    </small>
                  )}
                  {errors.abn?.type === 'minLength' && (
                    <small className='text-red-900'>
                      This field should contain exaclty 11 chars
                    </small>
                  )}
                  {errors.abn?.type === 'maxLength' && (
                    <small className='text-red-900'>
                      This field should contain exaclty 11 chars
                    </small>
                  )}
                </div>
                {/* ABN tax ends here */}

                {/* country starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='businessCategory'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Country:
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <select
                        {...register('country', {
                          required: true,
                        })}
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      >
                        <option value=''>Select a country...</option>
                        {countryOptions.map((option) => (
                          <option
                            key={'commission-' + option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.country?.type === 'required' && (
                    <small className='text-red-900'>
                      This field is required
                    </small>
                  )}
                </div>
                {/* country ends here */}

                <div className='pt-8 space-y-6 divide-y divide-gray-200 sm:pt-10 sm:space-y-5'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    Default agreement
                  </h3>
                </div>

                {/* commission starts */}
                <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='commissionType'
                      className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                    >
                      Choose your commission:
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <select
                        {...register('commissionType', {})}
                        // onChange={handleDropdown}
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      >
                        <option value=''></option>
                        <option value='commissionPerReceivedLead'>
                          Commission per received lead ($)
                        </option>
                        <option value='commissionPerCompletedLead'>
                          Commission per completed lead ($)
                        </option>
                        <option value='commissionPerCompletedLeadPercent'>
                          Commission per completed lead (%)
                        </option>
                      </select>
                    </div>
                  </div>
                  {errors.commissionType?.type === 'required' && (
                    <small className='text-red-900'>
                      This field is required
                    </small>
                  )}
                </div>
                {/* commission ends here */}

                {/* Commission valued field starts here */}
                {
                  <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='commission value'
                        className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                      >
                        Commission value:
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <div className='flex max-w-lg rounded-md shadow-sm'>
                          <input
                            type='number'
                            step='0.01'
                            defaultValue={formValues.commissionValue}
                            {...register('commissionValue', {
                              maxLength: 255,
                            })}
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                          />
                        </div>
                      </div>
                    </div>
                    {errors.commissionValue?.type === 'required' && (
                      <small className='text-red-900'>
                        This field is required
                      </small>
                    )}
                  </div>
                }
                {/* Commission value field ends here */}

                {/* Commission per received lead field starts here */}
                {/* {receivedCash && (
                    <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                      <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                        <label
                          htmlFor='commissionPerReceivedLead'
                          className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                        >
                          Commission per received lead ($):
                        </label>
                        <div className='mt-1 sm:mt-0 sm:col-span-2'>
                          <div className='flex max-w-lg rounded-md shadow-sm'>
                            <input
                              type='number'
                              step='0.01'
                              defaultValue={
                                formValues.commissionPerReceivedLead
                              }
                              {...register('commissionPerReceivedLead', {
                                maxLength: 255,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      {errors.commissionPerReceivedLead?.type ===
                        'required' && (
                        <small className='text-red-900'>
                          This field is required
                        </small>
                      )}
                    </div>
                  )} */}
                {/* Commission per received lead field ends here */}

                {/* Commission per completed lead field starts here */}
                {/* {completedCash && (
                    <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                      <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                        <label
                          htmlFor='commissionPerCompletedLead'
                          className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                        >
                          Commission per completed lead ($):
                        </label>
                        <div className='mt-1 sm:mt-0 sm:col-span-2'>
                          <div className='flex max-w-lg rounded-md shadow-sm'>
                            <input
                              type='number'
                              step='0.01'
                              defaultValue={
                                formValues.commissionPerCompletedLead
                              }
                              {...register('commissionPerCompletedLead', {
                                maxLength: 255,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      {errors.commissionPerCompletedLead?.type ===
                        'required' && (
                        <small className='text-red-900'>
                          This field is required
                        </small>
                      )}
                    </div>
                  )} */}
                {/* Commission per received lead field ends here */}

                {/* Commission per received lead (%) field starts here */}
                {/* {receivedPercent && (
                    <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                      <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                        <label
                          htmlFor='commissionPerReceivedLeadPercent'
                          className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                        >
                          Commission per completed lead (%):
                        </label>
                        <div className='mt-1 sm:mt-0 sm:col-span-2'>
                          <div className='flex max-w-lg rounded-md shadow-sm'>
                            <input
                              type='number'
                              step='0.01'
                              defaultValue={
                                formValues.commissionPerReceivedLeadPercent
                              }
                              {...register('commissionPerReceivedLeadPercent', {
                                maxLength: 255,
                              })}
                              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            />
                          </div>
                        </div>
                      </div>
                      {errors.commissionPerReceivedLeadPercent?.type ===
                        'required' && (
                        <small className='text-red-900'>
                          This field is required
                        </small>
                      )}
                    </div>
                  )} */}
                {/* Commission per received lead (%) field ends here */}

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
              </div>
              {/* right panel ends here */}
            </div>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}
