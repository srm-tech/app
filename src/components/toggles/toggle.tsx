/* This example requires Tailwind CSS v2.0+ */
import { Switch } from '@headlessui/react';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  disabled?: boolean;
  label: string;
  description?: string;
  value: boolean;
  onChange: any;
}) {
  return (
    <Switch.Group as='div' className='flex items-center'>
      <Switch
        checked={value}
        onChange={onChange}
        className={classNames(
          value ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}
      >
        <span
          aria-hidden='true'
          className={classNames(
            value ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}
        />
      </Switch>
      <Switch.Label as='span' className='ml-3 leading-3'>
        <span className='text-sm font-medium text-gray-900'>{label} </span>
        <br />
        {description && (
          <span className='text-xs text-gray-500'>({description})</span>
        )}
      </Switch.Label>
    </Switch.Group>
  );
}
