import { Switch } from '@headlessui/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from 'use-http';

import { handleError } from '@/lib/helper';
import useRequest from '@/lib/useRequest';

import InlineError from '@/components/errors/InlineError';
import LoadingOverlay from '@/components/LoadingOverlay';

import userProfileApi from './requests';
import { UserProfile } from './UserProfileModel';
import { useSession } from '../session/SessionContext';

interface Profile {
  contactEmail: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  businessName: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function WithdrawForm({
  id,
  onSuccess,
  amount,
}: {
  id: string;
  amount: string;
  onSuccess: (data: UserProfile) => void;
}) {
  const [formValues, setFormValues] = useState<UserProfile>();
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const session = useSession();
  const getUserProfile = useRequest<UserProfile>(
    userProfileApi.getUserProfile,
    {
      runOnMount: true,
      onSuccess: (data: UserProfile) => {
        const profile = {
          ...data,
          beneficiary: {
            firstName: data.beneficiary?.firstName || data.firstName,
            lastName: data.beneficiary?.lastName || data.lastName,
            contactEmail: data.beneficiary?.contactEmail || data.contactEmail,
            bsb: data.beneficiary?.bsb || '',
            accountNo: data.beneficiary?.accountNo || '',
          },
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
  } = useForm();

  const saveUserProfile = async (data) => {
    setErrorMessage('');
    updateUserProfile.run(data);
  };

  return (
    <form
      id={id}
      className='text-left mt-4'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(saveUserProfile)(e);
      }}
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
            Beneficiary Details
          </h3>
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
                  {...register('beneficiary.firstName', {
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
                  {...register('beneficiary.lastName', {
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
                  {...register('beneficiary.contactEmail', {
                    required: false,
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
        <div className='mt-8'>
          <h3 className='text-base font-medium leading-6 text-gray-900'>
            Bank details
          </h3>
        </div>
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='bsb'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              BSB:
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='flex max-w-lg rounded-md shadow-sm'>
                <input
                  type='text'
                  {...register('beneficiary.bsb', {
                    required: true,
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
              {errors.bsb?.type === 'required' && (
                <small className='text-red-900'>This field is required</small>
              )}
            </div>
          </div>
          <div className='my-2'>
            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
              <label
                htmlFor='accountNo'
                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              >
                Account No:
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2'>
                <div className='flex max-w-lg rounded-md shadow-sm'>
                  <input
                    type='text'
                    {...register('beneficiary.accountNo', {
                      required: true,
                      maxLength: 255,
                    })}
                    className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  />
                </div>
                {errors.accountNo?.type === 'required' && (
                  <small className='text-red-900'>This field is required</small>
                )}
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </form>
  );
}
