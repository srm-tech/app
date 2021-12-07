import React from 'react';
import useFetch from 'use-http';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import Table from '@/components/table/Table';

export default function introductions() {
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch(process.env.BASE_URL + '/api/introductions', options, []);

  const columns = [
    {
      Header: 'name',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <>
          <div className='cell-name'>{original.name}</div>
          <div className='cell-email'>{original.email}</div>
          <div className='cell-phone'>{original.phone}</div>
        </>
      ),
    },
    { Header: 'businessCategory', accessor: 'businessCategory' },
    { Header: 'status', accessor: 'status' },
    { Header: 'commission earned', accessor: 'commissionEarned' },
    {
      Header: '',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        return <></>;
      },
    },
  ];

  const list = data || [];

  return (
    <DashboardLayout title='Introductions'>
      <Table columns={columns} data={list} />
    </DashboardLayout>
  );
}
