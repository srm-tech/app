import * as React from 'react';

export default function NewsLetter() {
  return (
    <div className='flex flex-col items-center px-4 mx-auto py-14 max-w-7xl sm:px-6 lg:px-8'>
      <p className='mb-10 text-xl text-center sm:text-2xl sm:w-4/6 '>
        Something related to leaving the email for updates and getting some of
        the early bird advantages (guru badge, unlimited access etc)
      </p>
      <div className='w-full sm:w-max'>
        <input
          type='text'
          name='name'
          id='name'
          autoComplete='name'
          placeholder='Full name'
          required
          className='block w-full mb-4 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-lg'
        />
        <button
          type='button'
          className='w-full px-5 py-2 text-base text-white uppercase bg-gray-700 border border-transparent rounded-md shadow-sm sm:text-xl hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
        >
          Sign me up to receive updates
        </button>
      </div>
    </div>
  );
}
