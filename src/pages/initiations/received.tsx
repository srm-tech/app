import React from 'react';

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Seo from '@/components/Seo';
import Table from '@/components/table/Table';

export default function initiationsReceived() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => [
    {
      firstName: 'Jan',
      lastName: 'Kowalski',
      age: 120,
      visits: 11123,
      status: 'dead',
      progress: 'very fast',
    },
  ]);

  return (
    <>
      <Seo templateTitle='Received initiations | introduce.guru' />
      <main>
        <div className='relative overflow-hidden bg-white'>
          <div>
            <div className='w-full py-5 bg-dark'>
              <Nav />
            </div>
            <div className='w-full px-5 my-10 bg-white text-dark document'>
              <Table columns={columns} data={data} />
            </div>
            <div className='w-full bg-dark'>
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
