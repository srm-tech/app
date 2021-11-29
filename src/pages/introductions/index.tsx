import Table from '@/components/table/Table';
import React from 'react';
import useFetch from 'use-http';
import StarRatingComponent from 'react-star-rating-component';

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
    { Header: 'business name', accessor: 'businessName' },
    { Header: 'businessCategory', accessor: 'businessCategory' },
    {
      Header: 'rating',
      accessor: 'rating',
      Cell: ({ value }) => <StarRatingComponent value={value} starCount={5} />,
    },
    {
      Header: 'succesful rate',
      accessor: 'succesfulRate',
      Cell: ({ value }) => <span>{value * 100}%</span>,
    },
    { Header: 'average commission', accessor: 'averageCommission' },
    { Header: 'status', accessor: 'status' },
    {
      Header: 'id',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        if (original.status === 'pending') {
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
