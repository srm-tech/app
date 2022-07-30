import { Switch } from '@headlessui/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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

export default function RegisterForm({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: (data: UserProfile) => void;
}) {
  const [formValues, setFormValues] = useState<UserProfile>();
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const session = useSession();
  const getUserProfile = useRequest<UserProfile>(
    userProfileApi.getUserProfile,
    {
      onSuccess: (data: UserProfile) => {
        const profile = {
          ...data,
          contactEmail: data.contactEmail || session.data.email,
        };
        setFormValues(profile);
        reset(profile);
      },
    }
  );
  const createUserProfile = useRequest<UserProfile>(
    userProfileApi.createUserProfile,
    {
      onSuccess: (data) => {
        onSuccess && onSuccess(data);
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
    if (id === 'registration' && !agreed) {
      return setErrorMessage('Please agree to our terms.');
    }

    if (id === 'registration') {
      createUserProfile.run(data);
    } else {
      updateUserProfile.run(data);
    }
  };

  useEffect(() => {
    if (session.isActive) {
      getUserProfile.run();
    }
  }, [session]);

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
        isLoading={
          getUserProfile.isLoading ||
          createUserProfile.isLoading ||
          updateUserProfile.isLoading
        }
      >
        {getUserProfile.error ||
          (createUserProfile.error && (
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
            Is your account tied to a company?
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
                    required: false,
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
        <div className='sm:col-span-2'>
          {id === 'registration' && (
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className={classNames(
                    agreed ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  )}
                >
                  <span className='sr-only'>Agree to policies</span>
                  <span
                    aria-hidden='true'
                    className={classNames(
                      agreed ? 'translate-x-5' : 'translate-x-0',
                      'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div className='ml-3'>
                <p className='text-base text-gray-500'>
                  By selecting this, you agree to the{' '}
                  <Link href='/legal/privacy' passHref>
                    <a
                      className='font-medium text-gray-700 underline'
                      target='_blank'
                    >
                      Privacy Policy
                    </a>
                  </Link>{' '}
                  and{' '}
                  <Link href='/legal/terms' passHref>
                    <a
                      className='font-medium text-gray-700 underline'
                      target='_blank'
                    >
                      Terms & Conditions
                    </a>
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className='py-4'>
              <InlineError message={errorMessage} />
            </div>
          )}
        </div>
      </LoadingOverlay>
    </form>
  );
}
