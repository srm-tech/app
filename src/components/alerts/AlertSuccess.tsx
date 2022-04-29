/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon } from '@heroicons/react/solid';

function Root({ title, description, children }) {
  return (
    <div className='rounded-md bg-green-50 p-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <CheckCircleIcon
            className='h-5 w-5 text-green-400'
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-green-800'>{title}</h3>
          <div className='mt-2 text-sm text-green-700'>
            <p>{description}</p>
          </div>
          <div className='mt-4'>{children}</div>
        </div>
      </div>
    </div>
  );
}
function AlertActionAsk({
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onCancel,
  onConfirm,
}) {
  return (
    <div className='-mx-2 -my-1.5 flex'>
      <button
        onClick={onCancel}
        type='button'
        className='bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600'
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        type='button'
        className='ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600'
      >
        {confirmLabel}
      </button>
    </div>
  );
}
function AlertActionConfirm({ confirmLabel = 'Confirm', onConfirm }) {
  return (
    <div className='-mx-2 -my-1.5 flex'>
      <button
        onClick={onConfirm}
        type='button'
        className='ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600'
      >
        {confirmLabel}
      </button>
    </div>
  );
}

export const Alert = Object.assign(Root, {
  AlertActionAsk,
  AlertActionConfirm,
});
