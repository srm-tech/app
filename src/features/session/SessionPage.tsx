import { useRouter } from 'next/router';

import NotifyCard from '@/components/alerts/NotifyCard';

export default function SuccessPage() {
  const { query } = useRouter();
  return (
    <div className='bg-gray-100 w-full h-screen flex justify-center'>
      <div className='mt-8'>
        <NotifyCard
          success={!query.error}
          title={query.error ? 'Invalid Link' : 'Success!'}
          description={
            query.error
              ? 'This link has expired. Please login again with new link.'
              : 'You can now close this tab and return to previous screen.'
          }
          btnLabel='Close this tab'
          onConfirm={() => window.close()}
        />
      </div>
    </div>
  );
}
