import { ClockIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Link from 'next/link';
import { SignUpForBetaForm } from './SignUpForBetaForm';
import { QuickForm } from '../introductions/QuickForm';

export default function Hero() {
  return (
    <section className=''>
      <div className='mx-auto max-w-7xl'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          <div className='px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center'>
            <div>
              <Link href='/#roadmap' passHref>
                <a className='inline-flex items-center p-1 pr-2 text-white bg-gray-900 rounded-full sm:text-base lg:text-sm xl:text-base hover:text-gray-200'>
                  <span className='px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-primary-400 rounded-full'>
                    Beta
                  </span>
                  <span className='ml-4 text-sm'>Coming soon</span>
                  <ClockIcon
                    className='w-5 h-5 ml-2 text-gray-500'
                    aria-hidden='true'
                  />
                </a>
              </Link>
              <h1 className='mt-4 text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl'>
                <span className='md:block'>Your success</span>{' '}
                <span className='text-dark-green md:block'>
                  powered by a referral network
                </span>
              </h1>
              <p className='mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl'>
                Digital marketing and advertising became very expensive. With
                Introduce Guru, you can incentivise trusted partners with
                referral fees and grow your business with $0 marketing costs.
              </p>
              {/* <p className='mt-8 text-sm font-semibold tracking-wide text-white uppercase sm:mt-10'>
                Supported by
              </p>
              <div className='w-full mt-5 sm:mx-auto sm:max-w-lg lg:ml-0'>
                <div className='flex flex-wrap items-start justify-between'>
                  <div className='flex justify-center px-1'>
                    <img
                      className='h-9 sm:h-10 opacity-70'
                      src='/home/testimonials/personal-painters.png'
                      alt='Tuple'
                    />
                  </div>
                  <div className='flex justify-center px-1'>
                    <img
                      className='h-9 sm:h-10'
                      src='https://tailwindui.com/img/logos/workcation-logo-gray-400.svg'
                      alt='Workcation'
                    />
                  </div>
                  <div className='flex justify-center px-1'>
                    <img
                      className='h-9 sm:h-10'
                      src='https://tailwindui.com/img/logos/statickit-logo-gray-400.svg'
                      alt='StaticKit'
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className='mx-5 mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 justify-self-end'>
            <QuickForm />
          </div>
        </div>
      </div>
    </section>
  );
}
