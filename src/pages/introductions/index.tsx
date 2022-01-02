import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import React, { useEffect, useState, version } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import useFetch from 'use-http';

import useModal from '@/lib/useModal';
import { formatCommissionDescriptions } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Modal from '@/components/modals/modal';
import Rating from '@/components/rating';
import Table from '@/components/table/Table';

export default function introductions() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(true);
  const [rating, setRating] = useState(1);

  const {
    isShowing,
    toggle,
    caption,
    setCaption,
    content,
    setContent,
    acceptCaption,
    setAcceptCaption,
    cancelCaption,
    setCancelCaption,
    accept,
    setAccept,
    cancel,
    setCancel,
  } = useModal();

  const { get, post, response, loading, error } = useFetch(
    `${process.env.BASE_URL}`,
    { cachePolicy: 'no-cache' },
    []
  );

  // prepare TimeAgo
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo('en-US');

  function handleCancelButton() {
    toggle();
  }

  function handleAcceptDoNothing() {
    window.location.href = `${process.env.BASE_URL}/introductions`;
  }

  async function handleRate(e, original) {
    toggle();
    setCaption(`Rate ${original.firstName} ${original.lastName}`);
    setAcceptCaption(null);
    setCancelCaption(null);
    const ratingContent = (
      <>
        <form
          onSubmit={(e) => {
            return null;
          }}
        >
          <div className='sm:col-span-4'>
            <label
              htmlFor='rate'
              className='block text-sm font-medium text-gray-700'
            >
              Your rating:
            </label>
            <div className='mt-1 rounded-md shadow-sm'>
              <Rating initialValue={1} />
            </div>
          </div>

          <div className='sm:col-span-4'>
            <label
              htmlFor='comment'
              className='block text-sm font-medium text-gray-700'
            >
              Comment:
            </label>
            <div className='mt-1 rounded-md shadow-sm'>
              <textarea></textarea>
            </div>
          </div>

          <div className='pt-5'>
            <div className='flex justify-end'>
              <button
                type='button'
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </>
    );
    setContent(ratingContent);
  }

  async function handleAccept(e, original) {
    async function handleAcceptButton() {
      const accept = await post('/api/introductions/accept', {
        introId: original._id,
      });

      window.location.href = `${process.env.BASE_URL}/introductions`;
    }

    const job = await get(`/api/job/details?id=${original._id}`);
    if (!job) {
      return null;
    }
    const reviewContent = formatCommissionDescriptions(job[0].agreement);
    setCaption('Review the agreement');
    setContent(`${reviewContent.key}: ${reviewContent.value}`);
    setAcceptCaption('Proceed');
    setCancelCaption('Cancel');
    setCancel(() => handleCancelButton);
    setAccept(() => handleAcceptButton);
    toggle();
    setReload(true);
  }

  async function handleDecline(e, original) {
    async function handleAcceptButton() {
      toggle();
      const decline = await post('/api/introductions/decline', {
        introId: original._id,
      });
      window.location.href = `${process.env.BASE_URL}/introductions`;
    }

    toggle();
    setCaption('Are you sure?');
    setContent('You are about to decline the introduction');
    setAcceptCaption("Yes, I'm sure");
    setCancelCaption('Cancel');
    setCancel(() => handleCancelButton);
    setAccept(() => handleAcceptButton);
    setReload(true);
  }

  async function handleFinaliseSubmit(e, jobId) {
    e.preventDefault();

    const stripePresent = await get(`/api/job/stripeCheck?id=${jobId}`);

    if (!stripePresent.stripeCheck && stripePresent.mailSent) {
      toggle();
      setCaption('The Guru has not connected his account with Stripe yet');
      setContent(
        'We sent the mail to the Guru, please come back and try again in a few days'
      );
      setAccept(() => handleAcceptDoNothing);
      setCancel(null);
      setAcceptCaption('OK');
      return;
    }
    const isStripeActive = await get(`/api/job/isStripeActive?id=${jobId}`);
    if (!isStripeActive.charges) {
      toggle();
      setCaption('The Guru has not set up his Stripe account yet');
      setContent(
        'We sent the mail to the Guru, please come back and try again in a few days'
      );
      setAccept(() => handleAcceptDoNothing);
      setCancel(null);
      setAcceptCaption('OK');
      return;
    }

    window.location.href = `${process.env.BASE_URL}/job/finalise?jobId=${jobId}`;
  }

  async function loadData() {
    const loaded = await get(`/api/introductions`);
    setReload(false);
    setData(loaded);
  }

  useEffect(() => {
    if (reload) {
      loadData();
    }
  }, [reload]);

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  const columns = [
    {
      Header: 'name',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <>
          <div className='cell-name'>
            {original.firstName} {original.lastName}
          </div>
          <div className='cell-company'>
            <small>{original.user.businessName}</small>
          </div>
          <div className='cell-email'>
            <small>{original.email}</small>
          </div>
          <div className='cell-phone'>
            <small>{original.user.phone}</small>
          </div>
        </>
      ),
    },
    {
      Header: 'business category',
      accessor: 'user.businessCategory',
    },
    { Header: 'position', accessor: 'position' },
    {
      Header: 'date',
      accessor: 'date',
      Cell: ({ row: { original } }) => (
        <>{timeAgo.format(new Date(original.date))}</>
      ),
    },
    { Header: 'status', accessor: 'status' },
    {
      Header: 'commission',
      accessor: 'commissionEarned',
      Cell: ({ row: { original } }) => (
        <>
          <div>
            <span className='text-yellow-500'>
              sent:{' '}
              {original.sumCommissionBusiness
                ? original.sumCommissionBusiness.toFixed(2)
                : 0}{' '}
              A$
            </span>
            <br />
            <span className='text-green-500'>
              received:{' '}
              {original.sumCommissionCustomer
                ? original.sumCommissionCustomer.toFixed(2)
                : 0}{' '}
              A$
            </span>
          </div>
        </>
      ),
    },
    {
      Header: '',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        const finishJobButton = (
          <>
            <div>
              <form
                action='/job/finalise'
                method='get'
                onSubmit={(e) => handleFinaliseSubmit(e, original._id)}
              >
                <input type='hidden' name='jobId' value={original._id} />
                <Button type='submit' variants='primary' className='text-xs'>
                  Finish job
                </Button>
              </form>
            </div>
          </>
        );

        const acceptDeclineButtons = (
          <>
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleAccept(e, original)}
              >
                Accept
              </Button>
              <Button
                variants='secondary'
                className='text-xs'
                onClick={(e) => handleDecline(e, original)}
              >
                Decline
              </Button>
            </div>
          </>
        );

        const rateButton = (
          <>
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleRate(e, original)}
              >
                Rate
              </Button>
            </div>
          </>
        );

        return (
          <>
            {original.status === 'pending' ? acceptDeclineButtons : null}
            {original.status === 'accepted' ? finishJobButton : null}
            {original.position === 'guru' ? rateButton : null}
          </>
        );
      },
    },
  ];

  const list = data || [];
  return (
    <DashboardLayout title='Introductions'>
      <LoadingOverlay active={loaderVisible} spinner>
        <Table columns={columns} data={list} loading={loading} />
        <div>
          <Modal
            isShowing={isShowing}
            acceptCaption={acceptCaption}
            cancelCaption={cancelCaption}
            hide={toggle}
            content={content}
            caption={caption}
            accept={accept}
            cancel={toggle}
          />
        </div>
      </LoadingOverlay>
    </DashboardLayout>
  );
}
