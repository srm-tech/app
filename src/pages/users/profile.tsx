import React from 'react';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import IGSwitch from '@/components/toggles/toggle';
import { Switch } from '@headlessui/react';

export default function profile() {
  return (
    <>
      <DashboardLayout>
        <div>
          <div className='md:grid md:grid-cols-3 md:gap-6'>
            {/* left panel */}
            <div className='p-4 text-white bg-green-800 md:col-span-1'>
              <div className='px-4 sm:px-0'>
                <h3 className='text-lg font-medium leading-6'>Profile</h3>
                <p className='mt-1 text-sm'>
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>

            {/* right panel */}
            <div className='mt-5 md:mt-0 md:col-span-2'>
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
                      {/* <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm">
                      workcation.com/
                    </span> */}
                      <input
                        type='text'
                        name='firstName'
                        id='firstName'
                        autoComplete='firstName'
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* first name field ends here */}

              {/* last name field starts */}
              <div className='p-4 mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                  <label
                    htmlFor='lastname'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    Last name:
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <div className='flex max-w-lg rounded-md shadow-sm'>
                      <input
                        type='text'
                        name='lastname'
                        id='lastname'
                        autoComplete='lastname'
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
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
                        name='email'
                        id='email'
                        autoComplete='email'
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
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
                        name='businessName'
                        id='businessName'
                        autoComplete='businessName'
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
                    </div>
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
                        name='businessCategory'
                        id='businessCategory'
                        autoComplete='businessCategory'
                        className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      />
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
                      {/* <input
                      type="text"
                      name="isGuru"
                      id="isGuru"
                      autoComplete="isGuru"
                      className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      
                    /> */}
                      <IGSwitch id='isGuru' name='isGuru' />
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
                      {/* <input
                      type="text"
                      name="isBusiness"
                      id="isBusiness"
                      autoComplete="isBusiness"
                      className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      
                    /> */}
                      <IGSwitch name='isBusiness' checked={false} />
                    </div>
                  </div>
                </div>
              </div>
              {/* business category field ends here */}
            </div>
            {/* right panel ends here */}
          </div>

          {/* <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div> */}
        </div>
      </DashboardLayout>
    </>
  );
}
