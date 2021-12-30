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

  function handleCancelButton() {
    toggle();
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

  // prepare TimeAgo
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo('en-US');

  const columns = [
    {
      Header: 'name',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <>
          <div className='cell-name'>
            {original.user.firstName} {original.user.lastName}
          </div>
          <div className='cell-company'>{original.user.businessName}</div>
          <div className='cell-email'>{original.user.email}</div>
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
            <span className='text-green-500'>
              received:{' '}
              {original.avgCommissionBusiness
                ? original.avgCommissionBusiness.toFixed(2)
                : 0}{' '}
              A$
            </span>
            &nbsp;&nbsp;
            <span className='text-red-500'>
              sent:{' '}
              {original.avgCommissionCustomer
                ? original.avgCommissionCustomer.toFixed(2)
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
              <form action='/job/finalise' method='get'>
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
