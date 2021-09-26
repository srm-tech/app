import { CheckIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import * as React from 'react';

const pricing = {
  tiers: [
    {
      title: 'Free',
      price: 0,
      frequency: '/month',
      description: 'The essentials to provide your best work for clients.',
      features: [
        '1 referral',
        'Free networking',
        'Hosted page for your services',
        'Basic analytics',
        '48-hour support response time',
        'Built in CRM',
      ],
      cta: 'Monthly billing',
      mostPopular: false,
    },
    {
      title: 'Small Business',
      price: 19,
      frequency: '/month',
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
      cta: 'Monthly billing',
      mostPopular: true,
    },
    {
      title: 'Growing business',
      price: 48,
      frequency: '/month',
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited referrals',
        'Free networking',
        'Hosted page for your services',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom integrations',
      ],
      cta: 'Monthly billing',
      mostPopular: false,
    },
  ],
};

export default function Pricing() {
  return (
    <div className='px-4 py-24 mx-auto bg-white max-w-7xl sm:px-6 lg:px-8'>
      <h2 className='text-3xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl'>
        Pricing
      </h2>
      <p className='max-w-2xl mt-6 text-xl text-gray-500'>
        Choose an affordable plan that's packed with the best features for
        engaging your referral partners, creating customer loyalty, and driving
        sales.
      </p>

      {/* Tiers */}
      <div className='mt-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8'>
        {pricing.tiers.map((tier) => (
          <div
            key={tier.title}
            className='relative flex flex-col p-8 bg-white border border-gray-200 shadow-sm rounded-2xl'
          >
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {tier.title}
              </h3>
              {tier.mostPopular ? (
                <p className='absolute top-0 py-1.5 px-4 bg-green-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2'>
                  Most popular
                </p>
              ) : null}
              <p className='flex items-baseline mt-4 text-gray-900'>
                <span className='text-5xl font-extrabold tracking-tight'>
                  ${tier.price}
                </span>
                <span className='ml-1 text-xl font-semibold'>
                  {tier.frequency}
                </span>
              </p>
              <p className='mt-6 text-gray-500'>{tier.description}</p>

              {/* Feature list */}
              <ul role='list' className='mt-6 space-y-6'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex'>
                    <CheckIcon
                      className='flex-shrink-0 w-6 h-6 text-green-500'
                      aria-hidden='true'
                    />
                    <span className='ml-3 text-gray-500'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href='#'
              className={clsx(
                tier.mostPopular
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-green-50 text-green-700 hover:bg-green-100',
                'mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium'
              )}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
