import { availableCommissions } from '@/lib/utils';

import {
  CommissionPaymentType,
  CommissionType,
} from '@/features/agreements/agreementConstants';

import Toggle from './toggles/toggle';

export default function Commission({ register, errors }) {
  console.log(2, errors);

  return (
    <div>
      <div className='pb-2'>
        <h3 className='text-base font-medium leading-6 text-gray-900'>
          My default commission terms
        </h3>
        <p className='max-w-2xl mt-1 text-sm text-gray-500'>
          Present your default agreement to your gurus wanting to send you
          introductions.
          <br />
        </p>
      </div>

      <div className='my-2'>
        <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center'>
          <label
            htmlFor='defaultCommission.0.commissionType'
            className='block text-sm font-medium text-gray-700'
          >
            How guru get's paid?
          </label>
          <div className='mt-1 sm:mt-0 sm:col-span-2'>
            <select
              {...register('defaultCommission.0.commissionType', {
                maxLength: 255,
                required: true,
              })}
              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
            >
              <option value={CommissionType.fixed}>Fixed Amount</option>
              <option value={CommissionType.percent}>
                Percent of the deal
              </option>
            </select>
          </div>
        </div>
        {errors.commissionType?.type === 'required' && (
          <small className='text-red-900'>This field is required</small>
        )}
      </div>
      <div className='my-2'>
        <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center'>
          <label
            htmlFor='defaultCommission.0commissionPaymentType'
            className='block text-sm font-medium text-gray-700'
          >
            When guru get's paid?
          </label>
          <div className='mt-1 sm:mt-0 sm:col-span-2'>
            <select
              {...register('defaultCommission.0.commissionPaymentType', {
                maxLength: 255,
                required: true,
              })}
              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
            >
              <option value={CommissionPaymentType.postpaid}>
                After I deliver the service / product
              </option>
              <option value={CommissionPaymentType.prepaid}>
                Pay straight away for received introduction
              </option>
            </select>
          </div>
        </div>
        {errors.commissionPaymentType?.type === 'required' && (
          <small className='text-red-900'>This field is required</small>
        )}
      </div>
      <div className='my-2'>
        <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
          <label
            htmlFor='defaultCommission.0.commissionAmount'
            className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
          >
            Commission Amount:
          </label>
          <div className='mt-1 sm:mt-0 sm:col-span-2'>
            <div className='flex max-w-lg rounded-md shadow-sm'>
              <input
                type='text'
                key={'commissionAmount'}
                {...register('defaultCommission.0.commissionAmount', {
                  required: true,
                  maxLength: 255,
                })}
                className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
              />
            </div>
            {errors.defaultCommission?.[0]?.commissionAmount?.type ===
              'required' && (
              <small className='text-red-900'>This field is required</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
