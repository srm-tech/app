import Table from '@/components/table/Table';
import React from 'react';
import useFetch from 'use-http';

export default function initiationsReceived() {
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch('http://localhost:3001/api/invitations/received', options, []);
  const columns = [
    { Header: 'name', accessor: 'name' },
    { Header: 'email', accessor: 'email' },
    { Header: 'phone', accesor: 'phone' },
    { Header: 'business name', accessor: 'businessName' },
    { Header: 'businessCategory', accessor: 'businessCategory' },
    { Header: 'rating', accessor: 'rating' },
    { Header: 'succesful rate', accessor: 'succesfulRate' },
    { Header: 'average commission', accessor: 'averageCommission' },
    { Header: 'status', accessor: 'status', filter: SliderColumnFilter },
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}
