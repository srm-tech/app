import { FC, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { classNames } from '@/lib/helper';

import requests from './requests';

const MagicLinkForm = ({
  className = '',
  onSubmit,
}: {
  className?: string;
  onSubmit: ({ email }) => void;
}) => {
  const [email, setEmail] = useState('');

  const create = () => {
    onSubmit({ email });
  };

  return (
    <div className={classNames(className)}>
      <input
        type='email'
        name='email'
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
        placeholder='you@example.com'
      />
      <div className='mt-4'>
        <button
          type='button'
          className='w-full focus:outline-none inline-flex justify-center rounded-md border border-transparent bg-primary-400 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          onClick={create}
        >
          Sign In with link
        </button>
      </div>
    </div>
  );
};

export default MagicLinkForm;
