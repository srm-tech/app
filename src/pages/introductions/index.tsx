import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import useFetch from 'use-http';

import Button from '@/components/buttons/Button';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Table from '@/components/table/Table';

export default function introductions() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(true);

  const { get, post, response, loading, error } = useFetch(
    `${process.env.BASE_URL}`,
    { cachePolicy: 'no-cache' },
    []
  );

  async function handleAccept(e, introId) {
    const accept = await post('/introductions/accept', {
      introId: introId,
    });
    setReload(true);
  }

  async function handleDecline(e, introId) {
    const decline = await post('/introductions/decline', {
      introId: introId,
    });
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

  const columns = [
    {
      Header: 'name',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <>
          <div className='cell-name'>
            {original.user.firstName} {original.user.lastName}
          </div>
          <div className='cell-email'>{original.user.email}</div>
          <div className='cell-phone'>{original.user.phone}</div>
        </>
      ),
    },
    { Header: 'businessCategory', accessor: 'user.businessCategory' },
    { Header: 'status', accessor: 'status' },
    { Header: 'commission earned', accessor: 'commissionEarned' },
    {
      Header: '',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        console.log(original);
        const reclaimButton = (
          <>
            <div>
              <form action='/job/finalise' method='post'>
                <input type='hidden' name='jobId' value={original._id} />
                <Button type='submit' variants='primary' className='text-xs'>
                  Reclaim payment
                </Button>
              </form>
            </div>
          </>
        );

        const id = original._id;
        const acceptDeclineButtons = (
          <>
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleAccept(e, id)}
              >
                Accept
              </Button>
              <Button
                variants='secondary'
                className='text-xs'
                onClick={(e) => handleDecline(e, id)}
              >
                Decline
              </Button>
            </div>
          </>
        );

        return (
          <>
            {original.status === 'pending'
              ? acceptDeclineButtons
              : reclaimButton}
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
      </LoadingOverlay>
    </DashboardLayout>
  );
}
