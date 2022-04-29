import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

export default function NotifyCard({
  title,
  description,
  btnLabel = 'Ok, got it',
  onConfirm,
  success = false,
}) {
  return (
    <div className='bg-white relative inline-blockbg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
      <div>
        <div
          className={clsx(
            'mx-auto flex items-center justify-center h-12 w-12 rounded-full',
            success ? 'bg-green-100' : 'bg-red-100'
          )}
        >
          {success ? (
            <CheckIcon
              className={clsx('h-6 w-6 text-green-600')}
              aria-hidden='true'
            />
          ) : (
            <ExclamationIcon
              className={clsx('h-6 w-6 text-red-600')}
              aria-hidden='true'
            />
          )}
        </div>
        <div className='mt-3 text-center sm:mt-5'>
          <h3>{title}</h3>
          <div className='mt-2'>
            <p className='text-sm text-gray-500'>{description}</p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-6'>
        <button
          type='button'
          className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm'
          onClick={onConfirm}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}
