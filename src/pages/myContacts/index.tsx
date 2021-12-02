import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import useFetch from 'use-http';

import Table from '@/components/table/Table';

export default function myContacts() {
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch(process.env.BASE_URL + '/api/myContacts', options, []);

  const columns = [
    {
      Header: 'name',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <>
          <div className='cell-name'>
            {original.contact.firstName} {original.contact.lastName}
          </div>
          <div className='cell-email'>{original.contact.email}</div>
          <div className='cell-phone'>{original.contact.phone}</div>
        </>
      ),
    },
    { Header: 'business name', accessor: 'contact.businessName' },
    { Header: 'businessCategory', accessor: 'contact.businessCategory' },
    {
      Header: 'rating',
      accessor: 'contact.rating',
      Cell: ({ value }) => <StarRatingComponent value={value} starCount={5} />,
    },
    {
      Header: 'succesful rate',
      accessor: 'contact.succesfulRate',
      Cell: ({ value }) => <span>{value * 100}%</span>,
    },
    { Header: 'average commission', accessor: 'contact.averageCommission' },
    { Header: 'status', accessor: 'status' },
    {
      Header: '',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        switch (original.status) {
          // pending
          case 'pending':
            return (
              <>
                <div>
                  <button className='cell-button-accept'>Accept</button>
                </div>
                <div>
                  <button className='cell-button-decline'>Decline</button>
                </div>
              </>
            );
          // empty
          default:
            return <></>;
        }
      },
    },
  ];

  return (
    <>
      <Table data={data} columns={columns} loading={loading} />
    </>
  );
}
