import Rating from '@/components/Rating';
import { formatCommissionDescriptions } from '@/lib/utils';
import { UserProfile } from '@/features/userProfile/UserProfileModel';

export default function BusinessDetails({
  business,
}: {
  business: UserProfile;
}) {
  return (
    <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>
          Business Details
        </h3>
        {/* <p className='mt-1 max-w-2xl text-sm text-gray-500'>
          Personal details and application.
        </p> */}
      </div>
      <div className='border-t border-gray-200 px-4 py-5 sm:p-0 text-left'>
        <dl className='sm:divide-y sm:divide-gray-200'>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Contact name</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {business.name}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Company Name</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {business.businessName}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Email address</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {business.contactEmail}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Phone</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {business.contactPhone}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Rating</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              <Rating initialValue={business.avgRate || 0} />
              {business.avgRate}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>
              Offered Incentive
            </dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {formatCommissionDescriptions(business.commissionType)}:{' '}
              {business.agreement?.commissionValue?.toLocaleString('en-AU', {
                style: 'currency',
                currency: business?.agreement.commissionCurrency || 'AUD',
              })}{' '}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
