import { SearchIcon } from '@heroicons/react/solid';
import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import useFetch from 'use-http';

import Table from '@/components/table/Table';
import Link from '@/components/buttons/Link';

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
          <small>original.businessName</small>
        </>
      ),
    },
    { Header: 'business category', accessor: 'businessCategory' },
    {
      Header: 'average rating',
      accessor: 'avgRating',
      Cell: ({ value }) => (
        <StarRatingComponent value={value} starCount={5} editing={false} />
      ),
    },

    {
      Header: 'average commission',
      accessor: 'avgCommissionCustomer',
      Cell: ({ row: { original } }) => (
        <>
          <div>
            <span className='text-yellow-500'>
              sent:{' '}
              {original.avgCommissionBusiness
                ? original.avgCommissionBusiness.toFixed(2)
                : 0}{' '}
              A$
            </span>
            <br />
            <span className='text-green-500'>
              received:{' '}
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
      Header: 'favourites',
      accessor: 'isFavourite',
      Cell: ({ row: { original } }) => (
        <Link href='' onClick={(e) => handleToggleFav(e, original._id)}>
          {original.isFavourite ? (
            <span className='text-red-700' aria-label='remove from favourites'>
              &#x2665;
            </span>
          ) : (
            <span className='text-red-100' aria-label='add to favourites'>
              &#x2665;
            </span>
          )}
        </Link>
      ),
    },
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
            {/* {original.status === 'pending'
              ? acceptDeclineButtons
              : removeFromContactsButton}
            {original.isFavourite ? removeFromFavButton : addToFavButton} */}
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
