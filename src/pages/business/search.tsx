import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import useFetch from 'use-http';

import Table from '@/components/table/Table';
import { SearchIcon } from '@heroicons/react/solid';

searchForBusiness.getInitialProps = async ({ query }) => {
  const { data } = query;
  return { query };
};

export default function searchForBusiness(query) {
  const url = process.env.BASE_URL + '/api/business/search';
  const search = query.query.search;
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch(url + '?q=' + search, options, []);

  const list = data || [];
  const columns = [
    {
      Header: 'name',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <>
          <div className='cell-name'>
            {original.firstName} {original.lastName}
          </div>
          <div className='cell-email'>{original.email}</div>
          <div className='cell-phone'>{original.phone}</div>
        </>
      ),
    },
    { Header: 'business name', accessor: 'businessName' },
    { Header: 'business category', accessor: 'businessCategory' },
    {
      Header: 'rating',
      accessor: 'rating',
      Cell: ({ value }) => (
        <StarRatingComponent value={value} starCount={5} editing={false} />
      ),
    },
    {
      Header: 'succesful rate',
      accessor: 'succesfulRate',
      Cell: ({ value }) => <span>{value * 100}%</span>,
    },
    { Header: 'average commission', accessor: 'averageCommission' },
    {
      Header: 'favourites',
      accessor: 'isFavourite',
      Cell: ({ row: { original } }) => (
        <>{original.isFavourite ? <>&#x2665;</> : ''}</>
      ),
    },
    { Header: 'status', accessor: 'status' },
    {
      Header: '',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        const acceptDeclineButtons = (
          <>
            <div>
              <button className='cell-button-accept'>Accept</button>
            </div>
            <div>
              <button className='cell-button-decline'>Decline</button>
            </div>
          </>
        );

        const removeFromContactsButton = (
          <>
            <div>
              <button className='cell-button-decline'>
                Remove from contacts
              </button>
            </div>
          </>
        );

        const addToFavButton = (
          <>
            <div>
              <button className='cell-button-accept'>Add to favourites</button>
            </div>
          </>
        );

        const removeFromFavButton = (
          <>
            <div>
              <button className='cell-button-decline'>
                Remove from favourites
              </button>
            </div>
          </>
        );

        return (
          <>
            {original.status === 'pending'
              ? acceptDeclineButtons
              : removeFromContactsButton}
            {original.isFavourite ? removeFromFavButton : addToFavButton}
          </>
        );
      },
    },
  ];

  return (
    <>
      <form className='flex w-full md:ml-0' method='GET' id='search-form'>
        <label htmlFor='search-field' className='sr-only'>
          Search
        </label>
        <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
          <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
            <SearchIcon className='w-5 h-5' aria-hidden='true' />
          </div>
          <input
            id='search-field'
            className='block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm'
            placeholder='Search'
            type='search'
            name='search'
          />
        </div>
      </form>
      {<Table columns={columns} data={list} />}
    </>
  );
}
