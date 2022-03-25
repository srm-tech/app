import { Transition } from '@headlessui/react';
import React from 'react';

type Props = { loading: boolean };
type RelativeProps = { className: string };

export default function LoadingOverlay({ loading, children }: any) {
  return (
    <Transition
      show={loading}
      style={{ zIndex: 1000 }}
      leave='transition ease-in duration-500'
      leaveFrom='transform opacity-100'
      leaveTo='transform opacity-0'
      className='w-full h-full absolute inline-flex justify-center 
      items-center text-center'
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className='bg-white absolute opacity-80 top-0 w-full h-full z-1010'
      ></div>
      <div className='text-center z-1020'>
        <svg
          className='m-auto mb-4 animate-spin h-8 w-8 text-white'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx={12}
            cy={12}
            r={10}
            stroke='#10b981'
            strokeWidth={4}
          />
          <path
            className='opacity-75'
            fill='#10b981'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
        <div>{children}</div>
      </div>
    </Transition>
  );
}
export const Relative: React.FC<RelativeProps> = ({
  children,
  className = '',
}) => {
  return <div className={`relative ${className}`}>{children}</div>;
};
