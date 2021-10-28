import { CheckIcon } from '@heroicons/react/outline';
import * as React from 'react';
import UnstyledLink from '../links/UnstyledLink';

const pricing = {
  tiers: [
    {
      price: 0,
      features: [
        'Guru Supporter badge',
        'Free Access to all functionalities in Beta version',
        'Individual profile page including your logo',
      ],
      mostPopular: false,
      desc: 'Leave your email address to receive updates about the development of the site.',
      info: 'FREE',
    },
    {
      price: 99,
      features: [
        'Everything in the previous plan left, plus',
        '1 year subscription from the launch of the Final Version with unlimited access to all premium functionalities',
        'Invitation to monthly online networking event to grow your GURU network',
        '500 co-branded business cards with a QR code to help you build your referral network',
        'Your business name mentioned on the supporter page linked to your profile',
      ],
      mostPopular: true,
    },
    {
      price: 199,
      features: [
        'Everything in the previous plan left, plus',
        'Your logo published on the supporter page with a link to your profile',
        'Invitation for 1 person to a networking launch party in Sydney',
        'Major Guru Supporter badge',
      ],
      mostPopular: false,
    },
    {
      price: 299,
      features: [
        'Everything in the previous plan left, plus',
        'Your logo published on the supporter page with a link to your profile',
        'Invitation for 1 person to a networking launch party in Sydney',
        'Invitation for a second person',
        'Major Guru Supporter badge',
      ],
      mostPopular: false,
    },
    {
      price: 999,
      features: [
        'Everything in the previous plan left, plus',
        'Launch party gold supporter status. Your business will be promoted on the invitations as well as through the venue',
        '5 minutes presentation opportunity at the launch party to promote your business',
        'Access to the Introduce Guru Platform with all unlimited premium functionalities',
      ],
      mostPopular: false,
      info: 'ONLY 5',
    },
  ],
};

export default function Pricing() {
  return (
    <div className='px-4 pt-1 pb-20 mx-auto sm:pt-20 max-w-7xl sm:px-6 lg:px-8'>
      {/* Tiers */}
      <div className='pt-4 pb-2 mt-20 space-y-12 overflow-x-auto lg:flex lg:space-y-0 lg:gap-x-5'>
        {pricing.tiers.map((tier) => (
          <div
            key={tier.price}
            style={{ minWidth: 390 }}
            className='relative flex flex-col p-8 overflow-hidden bg-white border border-2 shadow-sm border-dark-green rounded-2xl'
          >
            <div className='flex-1'>
              <div className='p-8 -m-8 bg-light-green'>
                {/* {tier.mostPopular ? (
                  <p className='absolute top-0 py-1.5 px-4 bg-green-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2'>
                    Most popular
                  </p>
                ) : null} */}
                <div className='flex justify-between'>
                  <p className='flex items-baseline text-5xl font-extrabold tracking-tight text-dark sm:text-6xl'>
                    {/* <span className='text-5xl font-extrabold tracking-tight sm:text-6xl'> */}
                    ${tier.price}
                    {/* </span> */}
                  </p>
                  {tier.info && (
                    <div
                      className='px-3 py-1 bg-white rounded-full shadow-lg'
                      style={{ height: 'fit-content' }}
                    >
                      <p className='text-xl opacity-60'>{tier.info}</p>
                    </div>
                  )}
                </div>
                {/* {tier.price ? ( */}
                <UnstyledLink
                  href='/promotion/#notify'
                  className='inline-flex justify-center w-full py-3 mt-10 text-white transition border border-transparent rounded-md shadow-sm bg-dark-green felx sm:text-xl px-7 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600'
                >
                  <p className='text-lg sm:text-2xl'>Coming soon</p>
                </UnstyledLink>
                {/* ) : (
                  <div className='h-24'></div>
                )} */}
              </div>
              <div
                className='mt-8 -mx-8 border-t border-dark-green mb-7'
                style={{ borderWidth: 1 }}
              />

              {tier.desc && (
                <p className='mb-6 text-lg text-gray-500 sm:text-xl'>
                  {tier.desc}
                </p>
              )}
              <p className='text-dark mb-9'>WHAT'S INCLUDED</p>
              {/* Feature list */}
              <ul role='list' className='space-y-4 sm:space-y-6'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex'>
                    {/* <CheckIcon
                      className='flex-shrink-0 w-6 h-6 text-green-500'
                      aria-hidden='true'
                    /> */}
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='flex-shrink-0 mt-1'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM13.7071 8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 6.90237 12.6834 6.90237 12.2929 7.29289L9 10.5858L7.70711 9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071L8.29289 12.7071C8.68342 13.0976 9.31658 13.0976 9.70711 12.7071L13.7071 8.70711Z'
                        fill='#07504B'
                      />
                    </svg>
                    <span className='ml-3 text-lg text-gray-500 sm:text-xl'>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
