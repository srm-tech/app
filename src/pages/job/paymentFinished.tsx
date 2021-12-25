import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import useFetch from 'use-http';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import Seo from '@/components/Seo';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      jobId: query.jobId,
      amount: query.amount,
    },
  };
};

export default function StripeConfirmationPage(props) {
  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  async function setStatus() {
    await post('/api/job/setStatusPaid', {
      jobId: props.jobId,
      amount: props.amount,
    });
  }

  let amount = parseFloat(props.amount);
  if (amount) amount = amount / 100.0;

  useEffect(() => {
    setStatus();
  }, []);

  return (
    <>
      <Seo templateTitle='Payment finished' />

      <DashboardLayout>
        <div className='w-full bg-white h-pt-6 sm:pb-12'>
          <div className='flex flex-col items-center px-4 pt-24 mx-auto sm:pt-32 max-w-7xl sm:px-6 lg:px-8'>
            <h1 className='text-2xl text-center text-dark lg:text-5xl xl:text-6xl'>
              Thank you
            </h1>
            <p
              className='mt-8 text-xl text-center text-gray-400 lg:text-2xl xl:text-3xl sm:w-11/12 sm:leading-none sm:tracking-tight'
              style={{ lineHeight: 1.3 }}
            >
              You have succesfully paid {amount.toFixed(2)} A$.
            </p>

            <Link href='/introductions'>
              <a className='flex items-center justify-center px-4 py-2 text-base font-medium text-white border border-transparent rounded-md bg-primary-400 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 sm:mt-8'>
                Go back
              </a>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
