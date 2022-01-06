import Table from '@/components/table/Table';
import React from 'react';
import useFetch from 'use-http';

export default function Introductions() {
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch(process.env.BASE_URL + '/api/drafts', options, []);

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
        if (original.status === 'pending') {
          return (
            <>
              <button className='cell-button-accept'>Assign</button>
            </>
          );
        } else {
          return <></>;
        }
      },
    },
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}
