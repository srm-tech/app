import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { Fragment, ReactElement } from 'react';
import ReactDOM from 'react-dom';

import { classNames } from '@/lib/helper';

import LoadingOverlay from '../LoadingOverlay';

export default function ConfirmModal({
  isShowing,
  caption,
  content,
  onAccept: accept,
  form,
  acceptCaption,
  onCancel: cancel,
  cancelCaption,
  isClosable,
  isLoading,
  icon,
  size = 'lg',
  children,
}: {
  isShowing: boolean;
  caption?: string;
  content?: ReactElement | string;
  onAccept?: any;
  form?: string;
  acceptCaption?: string;
  onCancel: () => void;
  cancelCaption?: string;
  isClosable?: boolean;
  isLoading?: boolean;
  icon?: any;
  size?: 'lg' | 'md' | 'sm';
  children?: ReactElement;
}) {
  return process.browser && isShowing
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
              <div className='flex items-end justify-center min-h-screen text-center sm:block sm:p-0'>
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
                  <div
                    className={classNames(
                      'relative inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:align-middle sm:w-full',
                      (size === 'lg' && 'sm:max-w-lg') || '',
                      (size === 'md' && 'sm:max-w-md') || '',
                      (size === 'sm' && 'sm:max-w-sm') || ''
                    )}
                  >
                    <LoadingOverlay isLoading={isLoading}>
                      <div className='hidden sm:block absolute top-0 right-0 pt-5 pr-5'>
                        <button
                          type='button'
                          className='bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          onClick={cancel}
                        >
                          <span className='sr-only'>Close</span>
                          <XIcon className='h-6 w-6' aria-hidden='true' />
                        </button>
                      </div>
                      <div className='sm:flex sm:items-start'>
                        {icon && icon}
                        <div className='text-left mx-8 my-4'>
                          {caption && (
                            <Dialog.Title
                              as='h3'
                              className='text-lg leading-6 font-medium text-gray-900 truncate max-w-[400px]'
                            >
                              {caption}
                            </Dialog.Title>
                          )}
                          <div className='mt-4 relative'>
                            <div className='text-sm text-gray-500'>
                              {children}
                              {content}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={clsx(
                          `bg-gray-100 p-4 sm:grid  sm:gap-3 sm:grid-flow-row-dense`,
                          cancelCaption && acceptCaption
                            ? 'sm:grid-cols-2'
                            : 'sm:grid-cols-1'
                        )}
                      >
                        {acceptCaption && (
                          <button
                            form={form}
                            type='submit'
                            className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm'
                            onClickCapture={(e) => {
                              accept && accept(e);
                            }}
                          >
                            {acceptCaption}
                          </button>
                        )}

                        {cancelCaption && (
                          <button
                            type='button'
                            className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm'
                            onClick={cancel}
                          >
                            {cancelCaption}
                          </button>
                        )}
                      </div>
                    </LoadingOverlay>
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
