import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import countryList from 'react-select-country-list';

import useRequest from '@/lib/useRequest';

import Commission from '@/components/Commission';
import LoadingOverlay from '@/components/LoadingOverlay';
import Toggle from '@/components/toggles/toggle';

import userProfileApi from './requests';
import { UserProfile } from './UserProfileModel';
import { useSession } from '../session/SessionContext';

export default function ProfileForm({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess?: (data: UserProfile) => void;
}) {
  const [formValues, setFormValues] = useState();
  const session = useSession();
  console.log(session.data);

  const getUserProfile = useRequest<UserProfile>(
    userProfileApi.getUserProfile,
    {
      runOnMount: true,
      onSuccess: (data) => {
        const profile = {
          ...data,
          contactEmail: data.contactEmail || session.data.email,
          country: data.country || 'AU',
        };
        setFormValues(profile);
        reset(profile);
      },
    }
  );
  const updateUserProfile = useRequest<UserProfile>(
    userProfileApi.updateUserProfile,
    {
      onSuccess: (data) => {
        onSuccess && onSuccess(data);
      },
    }
  );

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm();

  const countryOptions = useMemo(() => countryList().getData(), []);

  const saveUserProfile = async (data) => {
    updateUserProfile.run({
      ...data,
      isAcceptingIntroductions: true,
    });
  };

  return (
    <form
      id='commission'
      className='text-left'
      onSubmit={handleSubmit(saveUserProfile)}
    >
      <LoadingOverlay
        isLoading={getUserProfile.isLoading || updateUserProfile.isLoading}
      >
        {getUserProfile.error ||
          (updateUserProfile.error && (
            <div className='relative bg-red-100'>
              <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                <div className='pr-16 sm:text-center sm:px-16'>
                  <p className='font-medium text-red-400'>
                    <span>
                      Uh, oh! A problem occurred during saving your data!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}

        <div>
          <h3 className='text-base font-medium leading-6 text-gray-900'>
            Personal Information
          </h3>
          <p className='max-w-2xl mt-1 text-sm text-gray-500'>
            Your Personal information is visible to your contacts only.
          </p>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                  {...register('firstName', {
                    required: true,
                    maxLength: 127,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
              {errors.firstName?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                />
              </div>
              {errors.lastName?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                  {...register('contactEmail', {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
              {errors.contactEmail?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
              {errors.contactEmail?.type === 'pattern' && (
                <small className='text-red-900'>The email is invalid</small>
              )}
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                  {...register('contactPhone', {
                    required: false,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
              {errors.contactPhone?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
              {errors.contactPhone?.type === 'pattern' && (
                <small className='text-red-900'>The phone is invalid</small>
              )}
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <h3 className='text-base font-medium leading-6 text-gray-900'>
            Business Information
          </h3>
          <p className='max-w-2xl mt-1 text-sm text-gray-500'>
            These information are public and visible to all guru members
            searching for business.
          </p>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                />
              </div>
              {errors.businessName?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='businessCategory'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              Business category:
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='rounded-md shadow-sm'>
                <input
                  type='text'
                  {...register('businessCategory', {
                    required: true,
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
                {errors.businessCategory?.type === 'required' && (
                  <small className='text-red-900'>This field is required</small>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='addressLine1'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              Address (line 1):
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='flex max-w-lg rounded-md shadow-sm'>
                <input
                  type='text'
                  {...register('addressLine1', {
                    required: true,
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
              {errors.addressLine1?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='addressLine2'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              Address (line 2):
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='flex max-w-lg rounded-md shadow-sm'>
                <input
                  type='text'
                  {...register('addressLine2', {
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                  {...register('abn', {
                    minLength: 11,
                    maxLength: 11,
                    required: false,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
            </div>
          </div>
          {errors.abn?.type === 'required' && (
            <small className='text-red-900'>This field is required</small>
          )}
          {errors.abn?.type === 'minLength' && (
            <small className='text-red-900'>
              This field should contain exactly 11 chars
            </small>
          )}
          {errors.abn?.type === 'maxLength' && (
            <small className='text-red-900'>
              This field should contain exactly 11 chars
            </small>
          )}
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
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
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.country?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
            </div>
          </div>
        </div>

        <Commission errors={errors} register={register} />
      </LoadingOverlay>
    </form>
  );
}
