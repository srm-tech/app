import { availableCommissions } from '@/lib/utils';

export default function Commission({
  onChange,
  register,
  errors,
  value,
  type,
}) {
  return (
    <div>
      <div className='pb-2'>
        <h3 className='text-lg font-medium leading-6 text-gray-900'>
          My default commission terms
        </h3>
        <p className='max-w-2xl mt-1 text-sm text-gray-500'>
          Present your default agreement to your gurus wanting to send you
          introductions.
          <br />
        </p>
      </div>

      {/* commission starts */}
      <div className='my-2'>
        <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
          <label
            htmlFor='commissionType'
            className='block text-sm font-medium text-gray-700'
          >
            Choose your commission:
          </label>
          <div className='mt-1 sm:mt-0 sm:col-span-2'>
            <select
              {...register('commissionType', {
                maxLength: 255,
                onChange,
                required: true,
              })}
              className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
            >
              <option value='commissionPerReceivedLead'>
                {availableCommissions['commissionPerReceivedLead']}
              </option>
              <option value='commissionPerCompletedLead'>
                {availableCommissions['commissionPerCompletedLead']}
              </option>
              <option value='commissionPerCompletedLeadPercent'>
                {availableCommissions['commissionPerCompletedLeadPercent']}
              </option>
            </select>
          </div>
        </div>
        {errors.commissionType?.type === 'required' && (
          <small className='text-red-900'>This field is required</small>
        )}
      </div>
      {/* commission ends here */}

      {/* Commission per received lead field starts here */}
      {type === 'commissionPerReceivedLead' && (
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='commissionPerReceivedLead'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              {availableCommissions['commissionPerReceivedLead']}:
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='flex max-w-lg rounded-md shadow-sm'>
                <input
                  type='number'
                  step='0.01'
                  defaultValue={value}
                  {...register('commissionPerReceivedLead', {
                    setValueAs: (v) => parseInt(v),
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
            </div>
          </div>
          {errors.commissionPerReceivedLead?.type === 'required' && (
            <small className='text-red-900'>This field is required</small>
          )}
        </div>
      )}
      {/* Commission per received lead field ends here */}

      {/* Commission per completed lead field starts here */}
      {type === 'commissionPerCompletedLead' && (
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='commissionPerCompletedLead'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              {availableCommissions['commissionPerCompletedLead']}:
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='flex max-w-lg rounded-md shadow-sm'>
                <input
                  type='number'
                  step='0.01'
                  defaultValue={value}
                  {...register('commissionPerCompletedLead', {
                    setValueAs: (v) => parseInt(v),
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
            </div>
          </div>
          {errors.commissionPerCompletedLead?.type === 'required' && (
            <small className='text-red-900'>This field is required</small>
          )}
        </div>
      )}
      {/* Commission per received lead field ends here */}

      {/* Commission per received lead (%) field starts here */}
      {type === 'commissionPerCompletedLeadPercent' && (
        <div className='my-2'>
          <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start'>
            <label
              htmlFor='commissionPerCompletedLeadPercent'
              className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
            >
              {availableCommissions['commissionPerCompletedLeadPercent']}:
            </label>
            <div className='mt-1 sm:mt-0 sm:col-span-2'>
              <div className='flex max-w-lg rounded-md shadow-sm'>
                <input
                  type='number'
                  step='0.01'
                  defaultValue={value}
                  {...register('commissionPerCompletedLeadPercent', {
                    setValueAs: (v) => parseInt(v),
                    maxLength: 255,
                  })}
                  className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                />
              </div>
            </div>
          </div>
          {errors.commissionPerCompletedLeadPercent?.type === 'required' && (
            <small className='text-red-900'>This field is required</small>
          )}
        </div>
      )}
      {/* Commission per received lead (%) field ends here */}
    </div>
  );
}
