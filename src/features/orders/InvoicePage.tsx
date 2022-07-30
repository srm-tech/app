import { useRouter } from 'next/router';
import { useState } from 'react';

import { classNames } from '@/lib/helper';
import useRequest from '@/lib/useRequest';

import { Order } from './OrderModel';

const InvoicePage = ({
  className = '',
  onSubmit,
}: {
  className?: string;
  onSubmit: ({ email }) => void;
}) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const orderId = router.query['orderId'];
  const updateUserProfile = useRequest<Order, Pick<Order, '_id'>>(
    userProfileApi.updateUserProfile,
    {
      onSuccess: (userProfile) => {
        userProfileStore.setState({ userProfile });
        toast.success('Your business profile is now hidden!');
      },
    }
  );

  const create = () => {
    onSubmit({ email });
  };

  return (
    <div className={classNames('max-w-2xl', className)}>
      <header className='text-right'>
        SRM Tech Pty Ltd Address Sydney ABN: XYZ
      </header>
      <section>
        <h2>Invoice #IG-${orderId}</h2>
        <div>
          <p>For:</p>
        </div>
      </section>
      <footer></footer>
    </div>
  );
};

export default InvoicePage;
