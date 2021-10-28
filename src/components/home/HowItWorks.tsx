import Image from 'next/image';

import { Icon } from './Icons';

const data = [
  {
    title: 'Introduction',
    desc: 'Receive details of your new clients from your trusted network.',
  },
  {
    title: 'Close the deal',
    desc: 'Complete the work requested by the referred client and receive the payment.',
  },
  {
    title: 'Reward Partners',
    desc: 'Reward and incentivise your referrer partner by sharing your profit.',
  },
];

export default function HowItWorks() {
  const lastIndex = data.length - 1;
  return (
    <div className='flex flex-col px-4 py-24 mx-auto align-middle sm:py-32 max-w-7xl sm:px-6 lg:px-8'>
      <h2 className='text-4xl text-center text-dark lg:text-5xl'>
        How it works?
      </h2>

      <div className='container flex flex-wrap px-5 mx-auto mt-24'>
        <div className='flex flex-wrap w-full'>
          <div className='lg:w-3/5 md:w-1/2 md:pr-10 md:py-6'>
            {data.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className='relative flex pb-12 h-36'
              >
                {index !== lastIndex && (
                  <div className='absolute inset-0 flex items-center justify-center w-12 h-full'>
                    <div className='w-1 h-full bg-gray-700 pointer-events-none'></div>
                  </div>
                )}
                <div className='relative z-10 inline-flex items-center justify-center flex-shrink-0 w-12 h-12 text-white bg-dark rounded-full'>
                  <h3>{index + 1}</h3>
                </div>
                <div className='flex-grow pl-4'>
                  <h2 className='mb-1 text-2xl font-medium tracking-wider text-dark title-font'>
                    {item.title}
                  </h2>
                  <p className='text-lg leading-relaxed text-dark opacity-60'>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <img
            className='object-contain object-center mt-12 rounded-lg lg:w-2/5 md:w-1/2 md:mt-0'
            src='/home/img/how-it-works.svg'
            alt='how it works illustration'
          />
        </div>
      </div>
    </div>
  );
}
