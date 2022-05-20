import React from 'react';

export default function LoadingOverlay({ isLoading, children }: any) {
  return (
    <div>
      {isLoading && (
        <div>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className='bg-white absolute top-0 left-0 w-full h-full z-20 opacity-50 transition-opacity'
          ></div>
          <div className='absolute top-0 left-0 w-full h-full flex items-center'>
            <svg
              className='m-auto animate-spin h-10 w-10 text-white'
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
          </div>
        </div>
      )}
      <div className='z-10'>{children}</div>
    </div>
  );
}
