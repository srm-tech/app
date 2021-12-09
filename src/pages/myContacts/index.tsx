import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import StarRatingComponent from 'react-star-rating-component';
import useFetch from 'use-http';

import Button from '@/components/buttons/Button';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Table from '@/components/table/Table';

export default function myContacts() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);

  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  useEffect(() => {
    async function loadData() {
      const loaded = await get('/api/myContacts');
      setData(loaded);
    }
    loadData();
  }, []);

  async function handleAccept(e, invitationId) {
    const accept = await post('/api/invitations/accept', {
      invitationId: invitationId,
    });
    setData([]);
  }

  async function handleDecline(e, invitationId) {
    const decline = await post('/api/invitations/decline', {
      invitationId: invitationId,
    });
  }

  async function handleToggleFav(e, contactId) {
    const fav = await post('/api/favourites/toggle', { contactId: contactId });
  }

  async function handleRemoveFromContacts(e, contactId) {
    const remove = await post('/api/myContacts/remove', {
      contactId: contactId,
    });
  }

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
            {original.contact.firstName} {original.contact.lastName}
          </div>
          <div className='cell-email'>{original.contact.email}</div>
          <div className='cell-phone'>{original.contact.phone}</div>
        </>
      ),
    },
    { Header: 'business name', accessor: 'contact.businessName' },
    { Header: 'business category', accessor: 'contact.businessCategory' },
    {
      Header: 'rating',
      accessor: 'contact.rating',
      Cell: ({ value }) => (
        <StarRatingComponent value={value} starCount={5} editing={false} />
      ),
    },
    {
      Header: 'succesful rate',
      accessor: 'contact.succesfulRate',
      Cell: ({ value }) => <span>{value * 100}%</span>,
    },
    { Header: 'average commission', accessor: 'contact.averageCommission' },
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

        const removeFromContactsButton = (
          <>
            <div>
              <Button
                variants='secondary'
                className='text-xs'
                onClick={(e) => handleRemoveFromContacts(e, id)}
              >
                Remove from contacts
              </Button>
            </div>
          </>
        );

        const addToFavButton = (
          <>
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleToggleFav(e, id)}
              >
                Add to favourites
              </Button>
            </div>
          </>
        );

        const removeFromFavButton = (
          <>
            <div>
              <Button
                variants='secondary'
                className='text-xs'
                onClick={(e) => handleToggleFav(e, id)}
              >
                Remove from favourites
              </Button>
            </div>
          </>
        );

        return (
          <>
            <small className='text-xs'>{original._id}</small>
            {original.status === 'pending' ? acceptDeclineButtons : <></>}
            {original.isFavourite ? removeFromFavButton : addToFavButton}
          </>
        );
      },
    },
  ];

  return (
    <DashboardLayout title='My Contacts'>
      <LoadingOverlay active={loaderVisible} spinner>
        <Table data={data} columns={columns} loading={loading} />
      </LoadingOverlay>
    </DashboardLayout>
  );
}
