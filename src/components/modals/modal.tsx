import { Dialog, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({
  isShowing,
  hide,
  caption,
  content,
  accept,
  acceptCaption,
  cancel,
  cancelCaption,
}) {
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <Transition.Root show={true} as={Fragment}>
            <Dialog
              as='div'
              className='fixed inset-0 z-10 overflow-y-auto'
              onClose={() => {
                return false;
              }}
            >
              <div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Dialog.Overlay className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className='hidden sm:inline-block sm:align-middle sm:h-screen'
                  aria-hidden='true'
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                >
                  <div className='inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
                    <div>
                      <div className='flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full'>
                        <QuestionMarkCircleIcon
                          className='w-6 h-6 text-green-600'
                          aria-hidden='true'
                        />
                      </div>
                      <div className='mt-3 text-center sm:mt-5'>
                        <Dialog.Title
                          as='h3'
                          className='text-lg font-medium leading-6 text-gray-900'
                        >
                          {caption}
                        </Dialog.Title>
                        <div className='mt-2'>
                          <p className='text-sm text-gray-500'>{content}</p>
                        </div>
                      </div>
                    </div>
                    <div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'>
                      <button
                        type='button'
                        className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm'
                        onClick={accept}
                      >
                        {acceptCaption}
                      </button>
                      <button
                        type='button'
                        className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm'
                        onClick={cancel}
                      >
                        {cancelCaption}
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </React.Fragment>,
        document.body
      )
    : null;
}
