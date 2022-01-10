import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import React, { useEffect, useState, version } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import useFetch, { CachePolicies } from 'use-http';

import useModal from '@/lib/useModal';
import { formatCommissionDescriptions } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Modal from '@/components/modals/ConfirmModal';
import Rating from '@/components/Rating';
import Table from '@/components/table/Table';

import DashboardLayout from '@/layouts/DashboardLayout';

// prepare TimeAgo
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-AU');

export default function Introductions() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(true);

  const {
    isShowing,
    toggle,
    caption,
    setCaption,
    content,
    setContent,
    acceptCaption,
    setAcceptCaption,
    cancelCaption,
    setCancelCaption,
    accept,
    setAccept,
    cancel,
    setCancel,
  } = useModal();

  const { get, post, response, loading, error } = useFetch(
    `${process.env.BASE_URL}`,
    { cachePolicy: CachePolicies.NO_CACHE },
    []
  );

  function handleCancelButton() {
    toggle();
  }

  function handleAcceptDoNothing() {
    window.location.href = `${process.env.BASE_URL}/introductions`;
  }

  async function handleRate(e, original) {
    async function handleAcceptButton() {
      const form: any = document.getElementById('rateForm');
      const rate = form?.elements[5].value;
      const comment = form?.elements[6].value;

      const rating = await post('/api/job/rate', {
        rate: rate,
        comment: comment,
        jobId: original._id,
      });
      window.location.href = `${process.env.BASE_URL}/introductions`;
    }

    let ratingLength = 0;
    if ('review' in original) {
      ratingLength = original.review.length;
    }
    let defaultRate = 1;
    let defaultComment = '';
    if (ratingLength > 0) {
      defaultComment = original.review[0].comment;
      defaultRate = original.review[0].rate;
    }
    toggle();
    setCaption(`Rate ${original.firstName} ${original.lastName}`);
    setAcceptCaption('Rate');
    setAccept(() => handleAcceptButton);

    const ratingContent = (
      <>
        <form id='rateForm'>
          <div className='pt-4 sm:col-span-4'>
            <label
              htmlFor='rate'
              className='block text-sm font-medium text-gray-700'
            >
              Your rating:
            </label>
            <div className='mt-1 rounded-md shadow-sm'>
              <Rating
                initialValue={defaultRate}
                name={'rating-' + original.guru._id}
                editing
              />
            </div>
          </div>

          <div className='sm:col-span-4'>
            <label
              htmlFor='comment'
              className='block text-sm font-medium text-gray-700'
            >
              Comment:
            </label>
            <div className='mt-1 rounded-md shadow-sm'>
              <textarea name='comment'>{defaultComment}</textarea>
            </div>
          </div>
        </form>
      </>
    );
    setContent(ratingContent);
  }

  async function handleAccept(e, original) {
    async function handleAcceptButton() {
      const accept = await post('/api/introductions/accept', {
        introId: original._id,
      });

      window.location.href = `${process.env.BASE_URL}/introductions`;
    }

    const job = await get(`/api/job/details?id=${original._id}`);
    if (!job) {
      return null;
    }
    const reviewContent = formatCommissionDescriptions(job[0].agreement);
    // console.log('reviewContent:', job[0].agreement);
    setCaption('Review the agreement');
    setContent(`${reviewContent.key}: ${reviewContent.value}`);
    setAcceptCaption('Proceed');
    setCancelCaption('Cancel');
    setCancel(() => handleCancelButton);
    setAccept(() => handleAcceptButton);
    toggle();
    setReload(true);
  }

  async function handleDecline(e, original) {
    async function handleAcceptButton() {
      toggle();
      const decline = await post('/api/introductions/decline', {
        introId: original._id,
      });
      window.location.href = `${process.env.BASE_URL}/introductions`;
    }

    toggle();
    setCaption('Are you sure?');
    setContent('You are about to decline the introduction');
    setAcceptCaption("Yes, I'm sure");
    setCancelCaption('Cancel');
    setCancel(() => handleCancelButton);
    setAccept(() => handleAcceptButton);
    setReload(true);
  }

  async function handleFinaliseSubmit(e, jobId) {
    e.preventDefault();

    const stripePresent = await get(`/api/job/stripeCheck?id=${jobId}`);

    if (!stripePresent.stripeCheck && stripePresent.mailSent) {
      toggle();
      setCaption('The Guru has not connected his account with Stripe yet');
      setContent(
        'We sent the mail to the Guru, please come back and try again in a few days.'
      );
      setAccept(() => handleAcceptDoNothing);
      setCancel(null);
      setCancelCaption('OK');
      setAcceptCaption(null);
      return;
    }
    const isStripeActive = await get(`/api/job/isStripeActive?id=${jobId}`);
    if (!isStripeActive.charges) {
      toggle();
      setCaption('The Guru has not set up his Stripe account yet');
      setContent(
        'We sent the mail to the Guru, please come back and try again in a few days.'
      );
      setAccept(() => handleAcceptDoNothing);
      setCancel(null);
      setCancelCaption('OK');
      setAcceptCaption(null);
      return;
    }

    window.location.href = `${process.env.BASE_URL}/job/finalise?jobId=${jobId}`;
  }

  async function loadData() {
    const loaded = await get(`/api/introductions`);
    if (response.ok) {
      setReload(false);
      setData(loaded);
    }
  }

  useEffect(() => {
    if (reload) {
      loadData();
    }
  }, [reload]);

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  const columns = [
    {
      Header: 'introduced',
      accessor: 'introduced',
      Cell: ({ row: { original: data } }) => (
        <>
          <div className='cell-name'>{data.customer.name}</div>
          <div className='cell-email'>
            <a
              className='text-xs text-blue-500'
              href={`tel:${data.customer.email}`}
            >
              {data.customer.email}
            </a>
          </div>
          <div className='cell-phone'>
            <a
              className='text-xs text-blue-500'
              href={`tel:${data.customer.phone}`}
            >
              {data.customer.phone}
            </a>
          </div>
        </>
      ),
    },
    {
      Header: 'to',
      accessor: 'to',
      Cell: ({ row: { original: data } }) => (
        <>
          <div className='cell-name'>
            {data.position === 'guru' ? data.business.name : 'Me'}
          </div>
          {data.position === 'guru' && (
            <div className='text-xs cell-business'>
              <div>
                {data.business.company}{' '}
                {data.business.businessCategory &&
                  `| ${data.business.businessCategory}`}
              </div>
              <div>
                <a
                  className='text-xs text-blue-500'
                  href={`tel:${data.business.phone}`}
                >
                  {data.business.phone}
                </a>
              </div>
              <div>
                <a
                  className='text-xs text-blue-500'
                  href={`tel:${data.business.email}`}
                >
                  {data.business.email}
                </a>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      Header: 'by',
      accessor: 'by',
      Cell: ({ row: { original: data } }) => (
        <>
          <div className='cell-name'>
            {data.position === 'guru' ? 'Me' : data.guru.name}
          </div>
          {data.position === 'business' && (
            <div className='text-xs cell-business'>
              <div>
                <a
                  className='text-xs text-blue-500'
                  href={`tel:${data.guru.contactPhone}`}
                >
                  {data.guru.contactPhone}
                </a>
              </div>
              <div>
                <a
                  className='text-xs text-blue-500'
                  href={`tel:${data.guru.contactEmail}`}
                >
                  {data.guru.contactEmail}
                </a>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      Header: 'date',
      accessor: 'date',
      Cell: ({ row: { original } }) => (
        <>
          {original.date === undefined
            ? ''
            : timeAgo.format(new Date(original.date))}
        </>
      ),
    },
    { Header: 'status', accessor: 'status' },
    {
      Header: 'commission',
      accessor: 'commissionEarned',
      Cell: ({ row: { original: data } }) => (
        <>
          <div>
            {data.position === 'business' && (
              <span className='text-yellow-500'>
                {data.sumCommission.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: data.agreement.commissionCurrency || 'AUD',
                })}
              </span>
            )}
            <br />
            {data.position === 'guru' && (
              <span className='text-green-500'>
                received:{' '}
                {data.sumCommission.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: data.agreement.commissionCurrency || 'AUD',
                })}
              </span>
            )}
          </div>
        </>
      ),
    },
    {
      Header: '',
      accessor: '_id',
      Cell: ({ row: { original } }) => {
        const finishJobButton = (
          <>
            <div>
              <form
                action='/job/finalise'
                method='get'
                onSubmit={(e) => handleFinaliseSubmit(e, original._id)}
              >
                <input type='hidden' name='jobId' value={original._id} />
                <Button type='submit' variants='primary' className='text-xs'>
                  Finish job
                </Button>
              </form>
            </div>
          </>
        );

        const acceptDeclineButtons = (
          <>
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleAccept(e, original)}
              >
                Accept
              </Button>
            </div>
            <div>
              <Button
                variants='secondary'
                className='text-xs'
                onClick={(e) => handleDecline(e, original)}
              >
                Decline
              </Button>
            </div>
          </>
        );

        const rateButton = (
          <>
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleRate(e, original)}
              >
                Rate
              </Button>
            </div>
          </>
        );

        let initialRating;
        let ratingLength = 0;
        if ('review' in original) {
          ratingLength = original.review.length;
          initialRating = ratingLength > 0 ? original.review[0].rate : 1;
        }

        const rateStars = original.position === 'guru' && (
          <StarRatingComponent
            value={initialRating}
            // editing={false}
            starCount={5}
            emptyStarColor='#ccc'
            starColor='#fa0'
            onStarClick={(e) => handleRate(e, original)}
          />
        );

        return (
          <>
            {original.status === 'pending' ? acceptDeclineButtons : null}
            {original.status === 'accepted' && original.position === 'business'
              ? finishJobButton
              : null}
            {original.position === 'guru' && ratingLength === 0
              ? rateButton
              : null}
            {original.position === 'guru' && ratingLength > 0
              ? rateStars
              : null}
          </>
        );
      },
    },
  ];

  const list = data || [];
  console.log(list);

  return (
    <DashboardLayout title='Introductions' loading={loading}>
      <Table columns={columns} data={list} loading={loading} />
      <div>
        <Modal
          isShowing={isShowing}
          acceptCaption={acceptCaption}
          cancelCaption={cancelCaption}
          content={content}
          caption={caption}
          accept={accept}
          cancel={toggle}
        />
      </div>
    </DashboardLayout>
  );
}
