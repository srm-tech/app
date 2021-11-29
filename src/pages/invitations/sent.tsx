import Table from '@/components/table/Table';
import React from 'react';
import useFetch from 'use-http';
import StarRatingComponent from 'react-star-rating-component';

export default function initiationsReceived() {
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch(process.env.BASE_URL + '/api/invitations/sent', options, []);

  const columns = [
    { Header: 'name', accessor: 'name' },
    { Header: 'email', accessor: 'email' },
    { Header: 'phone', accesor: 'phone' },
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
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}
