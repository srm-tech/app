import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

const types = [
  {
    name: 'phone',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
        />
      </svg>
    ),
  },
  {
    name: 'email',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
    ),
  },
];

export default function ContactType({ onChange, value }) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <div className='flex items-center space-x-3'>
        {types.map((item) => (
          <RadioGroup.Option
            key={item.name}
            value={item.name}
            className={({ active, checked }) =>
              clsx(
                checked ? 'bg-light-green' : 'bg-gray-100',
                'p-1 relative rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
              )
            }
          >
            <RadioGroup.Label as='p' className='sr-only'>
              {item.name}
            </RadioGroup.Label>
            <div
              aria-hidden='true'
              className={clsx(
                // 'bg-gray-100',
                'h-8 w-8 rounded-full flex justify-center items-center'
              )}
            >
              {item.icon}
            </div>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
