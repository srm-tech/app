import { CheckIcon } from '@heroicons/react/outline';
import * as React from 'react';

const pricing = {
  tiers: [
    {
      price: 0,
      description: 'The essentials to provide your best work for clients.',
      features: [
        '1 referral',
        'Free networking',
        'Hosted page for your services',
        'Basic analytics',
        '48-hour support response time',
        'Built in CRM',
      ],
      mostPopular: false,
    },
    {
      price: 99,
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        '25 referrals',
        'Free networking',
        'Hosted page for your services',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
        'CRM integrations',
      ],
      mostPopular: true,
    },
    {
      price: 199,
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Potenti felis, in cras at at ligula nunc.',
        'Free networking',
        'Hosted page for your services',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom integrations',
      ],
      mostPopular: false,
    },
    {
      price: 299,
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Potenti felis, in cras at at ligula nunc.',
        'Free networking',
        'Hosted page for your services',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom integrations',
      ],
      mostPopular: false,
    },
    {
      price: 999,
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Potenti felis, in cras at at ligula nunc.',
        'Free networking',
        'Hosted page for your services',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom integrations',
      ],
      mostPopular: false,
    },
  ],
};

export default function Pricing() {
  return (
    <div className='px-4 pt-1 pb-20 mx-auto sm:pt-20 max-w-7xl sm:px-6 lg:px-8'>
      {/* Tiers */}
      <div className='pt-4 pb-2 mt-20 space-y-12 overflow-x-auto lg:flex lg:space-y-0 lg:gap-x-7'>
        {pricing.tiers.map((tier) => (
          <div
            key={tier.price}
            style={{ minWidth: 300 }}
            className='relative flex flex-col p-8 bg-white border border-gray-200 shadow-sm rounded-2xl'
          >
            <div className='flex-1'>
              {tier.mostPopular ? (
                <p className='absolute top-0 py-1.5 px-4 bg-green-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2'>
                  Most popular
                </p>
              ) : null}
              <p className='flex items-baseline mt-1 text-gray-700 sm:mt-4'>
                <span className='text-5xl font-extrabold tracking-tight sm:text-6xl'>
                  ${tier.price}
                </span>
              </p>
              {tier.price ? (
                <button
                  type='button'
                  className='inline-flex justify-center w-full py-3 mt-10 text-white transition bg-gray-700 border border-transparent rounded-md shadow-sm felx sm:text-xl px-7 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                >
                  <p className='text-lg sm:text-2xl'>BUY</p>
                </button>
              ) : (
                <p
                  className='mt-3 text-2xl font-thin text-gray-600'
                  style={{ marginBottom: '5.36rem' }}
                >
                  FREE
                </p>
              )}

              <div className='mt-8 -mx-8 border-t border-gray-200 mb-7' />
              <p className='text-gray-700 mb-9'>WHAT'S INCLUDED</p>
              {/* Feature list */}
              <ul role='list' className='space-y-4 sm:space-y-6'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex'>
                    <CheckIcon
                      className='flex-shrink-0 w-6 h-6 text-green-500'
                      aria-hidden='true'
                    />
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
