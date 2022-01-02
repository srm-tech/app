import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import useFetch from 'use-http';

import useModal from '@/lib/useModal';
import { formatCommissionDescriptions } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Modal from '@/components/modals/modal';
import Table from '@/components/table/Table';

export default function introductions() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(true);

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
          <div className='cell-company'>{original.user.businessName}</div>
          <div className='cell-email'>{original.email}</div>
          <div className='cell-phone'>{original.user.phone}</div>
        </>
      ),
    },
    { Header: 'businessCategory', accessor: 'user.businessCategory' },
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
        const finishJob = (
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

        return (
          <>
            {original.status === 'pending' ? acceptDeclineButtons : null}
            {original.status === 'accepted' ? finishJob : null}
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
