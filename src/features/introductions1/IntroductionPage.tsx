import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  version,
} from 'react';
import toast from 'react-hot-toast';

import 'react-loading-skeleton/dist/skeleton.css';

import { env } from '@/lib/envConfig';
import useRequest from '@/lib/useRequest';

import Button from '@/components/buttons/Button';
import Commission from '@/components/Commission';
import InlineError from '@/components/errors/InlineError';
import Modal from '@/components/modals/ConfirmModal';
import useModal from '@/components/modals/useModal';
import Rating from '@/components/Rating';
import Table from '@/components/table/Table';
import Toggle from '@/components/toggles/toggle';

import userProfileApi from '@/features/userProfile1/requests';
import {
  NewUserProfile,
  UserProfile,
} from '@/features/userProfile1/UserProfileModel';
import DashboardLayout from '@/layouts/DashboardLayout';
import DefaultLayout from '@/layouts/Default';

import { IntroductionStatus } from './introductionConstants';
import {
  Introduction,
  Quote,
  UpdateAgreementForIntroduction,
  UpdateStatusIntroduction,
} from './IntroductionModel';
import introductionApi from './requests';
import { CommissionType } from '../agreements/agreementConstants';
import {
  AgreementSummaryForBusiness,
  parseAmount,
  parseCommissionAmount,
} from '../agreements/AgreementSummary';
import ProfileForm from '../userProfile1/ProfileForm';
import userProfileStore from '../userProfile1/userStore';
// prepare TimeAgo
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-AU');

export default function Introductions() {
  const [introductions, setData] = useState<Introduction[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [dealValue, setDealValue] = React.useState<number | undefined>();
  const [quote, setQuote] = React.useState<Quote | undefined>();
  const [rowItem, setRowItem] = React.useState<Introduction | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showPaymentSummaryModal, setShowPaymentSummaryModal] = useState(false);
  const [modal, setModal] = useModal();
  const router = useRouter();
  const inputRef = useRef<any>();
  const userProfile = userProfileStore((state) => state.userProfile);
  const updateUserProfile = useRequest<UserProfile, NewUserProfile>(
    userProfileApi.updateUserProfile,
    {
      onSuccess: (userProfile) => {
        userProfileStore.setState({ userProfile });
        toast.success('Your business profile is now hidden!');
      },
    }
  );
  const searchIntroductions = useRequest<Introduction>(
    introductionApi.searchIntroductions,
    {
      runOnMount: true,
      onSuccess: (data) => setData(data),
    }
  );
  const updateIntroduction = useRequest<
    Introduction,
    UpdateStatusIntroduction | UpdateAgreementForIntroduction
  >(introductionApi.updateIntroduction, {
    onSuccess: useCallback(
      (updatedItem: Introduction) => {
        toast.success('Success. Introduction has been updated!');
      },
      [introductions]
    ),
  });
  const getQuoteRequest = useRequest<Introduction, any>(
    introductionApi.getQuote,
    {
      payload: rowItem?._id,
      dependencies: [dealValue, rowItem?._id],
      debounce: 400,
      onSuccess: (data) => {
        setQuote(data);
      },
    }
  );
  const getPaymentSession = useRequest(introductionApi.getPaymentSession, {
    onSuccess: () => {},
  });

  useEffect(() => {
    const paymentStatus = router.query['paymentStatus'];
    if (paymentStatus && paymentStatus === 'cancelled') {
      toast.error('Payment cancelled!');
    }
    if (paymentStatus && paymentStatus === 'success') {
      const introductionId = router.query['introductionId'];
      updateIntroduction.run({
        _id: `${introductionId}`,
        status: IntroductionStatus.PAYMENT_SUCCESS,
      });
      toast.success('Payment Successful!');
    }
    if (paymentStatus) {
      router.replace('/app/introductions');
    }
  }, [router.query]);

  useEffect(() => {
    setModal({ isLoading: updateIntroduction.isLoading });
  }, [updateIntroduction.isLoading]);

  const updateData = (newItem) => {
    if (newItem) {
      const newData = introductions.map((item) => {
        if (item._id === newItem._id) {
          return newItem;
        }
        return item;
      });
      setData(newData);
    }
  };

  function handleAcceptDoNothing() {
    window.location.href = `${env.BASE_URL}/app/introductions`;
  }

  async function handleRate(data: Introduction) {
    // const isGuru = data.guru.userId === userProfile?.userId;
    // async function handleAcceptButton() {
    //   const form: any = document.getElementById('rateForm');
    //   const rate = form?.elements[5].value;
    //   const comment = form?.elements[6].value;
    //   const rating = await post('/job/rate', {
    //     rate: rate,
    //     comment: comment,
    //     jobId: data._id,
    //   });
    //   window.location.href = `${env.BASE_URL}/app/introductions`;
    // }
    // let ratingLength = 0;
    // if ('review' in data) {
    //   ratingLength = data.review.length;
    // }
    // let defaultRate = 1;
    // let defaultComment = '';
    // if (ratingLength > 0) {
    //   defaultComment = data.review[0].comment;
    //   defaultRate = data.review[0].rating;
    // }
    // setModal({show: false, cancel: `Rate ${data.firstName} ${data.lastName}`});
    // setCaption(`Rate ${data.firstName} ${data.lastName}`);
    // setAcceptCaption('Rate');
    // setAccept(() => handleAcceptButton);
    // const ratingContent = (
    //   <>
    //     <form id='rateForm'>
    //       <div className='pt-4 sm:col-span-4'>
    //         <label
    //           htmlFor='rate'
    //           className='block text-sm font-medium text-gray-700'
    //         >
    //           Your rating:
    //         </label>
    //         <div className='mt-1 rounded-md shadow-sm'>
    //           <Rating
    //             initialValue={defaultRate}
    //             name={'rating-' + original.guru._id}
    //             editing
    //           />
    //         </div>
    //       </div>
    //       <div className='sm:col-span-4'>
    //         <label
    //           htmlFor='comment'
    //           className='block text-sm font-medium text-gray-700'
    //         >
    //           Comment:
    //         </label>
    //         <div className='mt-1 rounded-md shadow-sm'>
    //           <textarea name='comment'>{defaultComment}</textarea>
    //         </div>
    //       </div>
    //     </form>
    //   </>
    // );
    // setContent(ratingContent);
  }

  async function handleAcceptByBusiness(data) {
    setModal({
      show: true,
      isLoading: false,
      caption: 'Review your agreement with Guru',
      content: (
        <AgreementSummaryForBusiness
          agreement={data.agreement}
          guru={data.guru}
        />
      ),
      acceptCaption: 'Accept',
      cancelCaption: 'Cancel',
      onCancel: () => {
        setModal({ show: false });
      },
      onAccept: async () => {
        const updatedIntroduction = await updateIntroduction.run({
          _id: data._id,
          status: IntroductionStatus.ACCEPTED,
        });
        updateData(updatedIntroduction);
        setModal({ show: false });
      },
    });
  }

  async function handleDeclineByBusiness(data) {
    // async function handleAcceptButton() {
    //   setModal({ show: false });
    //   const decline = await post('/introductions/decline', {
    //     introId: data._id,
    //   });
    //   window.location.href = `${env.BASE_URL}/app/introductions`;
    // }
    // setModal({ show: false });
    // setCaption('Are you sure?');
    // setContent('You are about to decline the introduction');
    // setAcceptCaption("Yes, I'm sure");
    // setCancelCaption('Cancel');
    // setCancel(() => handleCancelButton);
    // setAccept(() => handleAcceptButton);
    // setReload(!reload);
  }

  async function handleCancelByGuru(data: Introduction) {
    setModal({
      show: true,
      isLoading: false,
      caption: 'Are you sure?',
      content: `This will cancel your introduction with ${data.business.businessName}. It will show as 'cancelled' for both parties`,
      acceptCaption: 'Ok',
      cancelCaption: 'Cancel',
      onCancel: () => {
        setModal({ show: false });
      },
      onAccept: async () => {
        const updatedIntroduction = await updateIntroduction.run({
          _id: data._id,
          status: IntroductionStatus.CANCELLED,
        });
        updateData(updatedIntroduction);
        setModal({ show: false });
      },
    });
  }

  const showPaymentSummary = async (data: Introduction) => {
    const { isFixed, value } = parseCommissionAmount(data.agreement);
    setErrorMessage('');

    setModal({
      show: true,
      isLoading: false,
      caption: 'Summary of payment',
      size: 'sm',
      content: (
        <div>
          <p>
            Your Guru {data.business.businessName} will receive {value}.
          </p>
          <p>Our fee: {value}.</p>
          {!isFixed && (
            <div className='mt-4'>
              <div className='mx-auto'>
                Please enter a value of a deal made {dealValue}:
                <input type='number' ref={inputRef} className='w-full' />
              </div>
            </div>
          )}
        </div>
      ),
      acceptCaption: isFixed ? `Pay` : `Pay`,
      cancelCaption: 'Cancel',
      onCancel: () => {
        setModal({ show: false });
      },
      onAccept: async () => {
        setErrorMessage('');

        if (!isFixed && !inputRef.current.value) {
          return setErrorMessage('Please enter deal value');
        }

        setModal({ ...modal, content: <div>xxxx</div> });

        // const updatedIntroduction = await updateIntroduction.run({
        //   _id: data._id,
        //   status: IntroductionStatus.CANCELLED,
        // });
        // updateData(updatedIntroduction);
        // setModal({ show: false });,
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'introduced',
        accessor: 'introduced',
        Cell: ({
          row: { original: data },
        }: {
          row: { original: Introduction };
        }) => (
          <>
            <div className='cell-name'>{data.customer.fullName}</div>
            <div className='cell-email'>
              <a
                className='text-xs text-blue-500'
                href={`tel:${data.customer.contactEmail}`}
              >
                {data.customer.contactEmail}
              </a>
            </div>
            <div className='cell-phone'>
              <a
                className='text-xs text-blue-500'
                href={`tel:${data.customer.contactPhone}`}
              >
                {data.customer.contactPhone}
              </a>
            </div>
          </>
        ),
      },
      {
        Header: 'to',
        accessor: 'to',
        Cell: ({
          row: { original: data },
        }: {
          row: { original: Introduction };
        }) => (
          <>
            <div className='cell-name'>
              {data.guru.userId === userProfile?.userId
                ? data.business.businessName
                : 'Me'}
            </div>
            {data.guru.userId === userProfile?.userId && (
              <div className='text-xs cell-business'>
                <div>
                  {data.business.fullName}{' '}
                  {data.business.businessCategory &&
                    `| ${data.business.businessCategory}`}
                </div>
                <div>
                  <a
                    className='text-xs text-blue-500'
                    href={`tel:${data.business.contactPhone}`}
                  >
                    {data.business.contactPhone}
                  </a>
                </div>
                <div>
                  <a
                    className='text-xs text-blue-500'
                    href={`tel:${data.business.contactEmail}`}
                  >
                    {data.business.contactEmail}
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
        Cell: ({
          row: { original: data },
        }: {
          row: { original: Introduction };
        }) => (
          <>
            <div className='cell-name'>
              {data.guru.userId === userProfile?.userId
                ? 'Me'
                : data.guru.fullName}
            </div>
            {data.guru.userId !== userProfile?.userId && (
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
        Cell: ({
          row: { original: data },
        }: {
          row: { original: Introduction };
        }) => <>{timeAgo.format(new Date(data.createdAt))}</>,
      },
      {
        Header: 'status',
        accessor: 'status',
        Cell: ({
          row: { original: data },
        }: {
          row: { original: Introduction };
        }) => {
          let statusLabel;
          switch (data.status) {
            case IntroductionStatus.PENDING:
              statusLabel = 'Awaiting approval';
              break;
            case IntroductionStatus.DECLINED:
              statusLabel = 'Declined';
              break;
            case IntroductionStatus.CANCELLED:
              statusLabel = 'Cancelled';
              break;
            case IntroductionStatus.ACCEPTED:
              statusLabel = 'Accepted';
              break;
            case IntroductionStatus.PAYMENT_SUCCESS:
              statusLabel = data.paid
                ? `Paid ${Number(data.paid).toLocaleString('en-AU', {
                    style: 'currency',
                    currency: data.agreement.commissionCurrency,
                  })}`
                : 'Paid';
              break;
            default:
              statusLabel = '';
              break;
          }
          return <>{statusLabel}</>;
        },
      },
      // {
      //   Header: 'commission',
      //   accessor: 'commissionEarned',
      //   Cell: ({
      //     row: { original: data },
      //   }: {
      //     row: { original: Introduction };
      //   }) => (
      //     <>
      //       <div>
      //         {data.guru.userId !== userProfile?.userId && (
      //           <span className='text-yellow-500'>
      //             {data.sumCommission.toLocaleString('en-AU', {
      //               style: 'currency',
      //               currency: data.agreement.commissionCurrency || 'AUD',
      //             })}
      //           </span>
      //         )}
      //         {data.guru.userId === userProfile?.userId && (
      //           <span className='text-green-500'>
      //             received:{' '}
      //             {data.sumCommission.toLocaleString('en-AU', {
      //               style: 'currency',
      //               currency: data.agreement.commissionCurrency || 'AUD',
      //             })}
      //           </span>
      //         )}
      //       </div>
      //     </>
      //   ),
      // },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({
          row: { original: data },
        }: {
          row: { original: Introduction };
        }) => {
          const completeButton = (
            <button
              onClick={() => {
                setRowItem(data);
                setShowPaymentSummaryModal(true);
              }}
              className='bg-green-500 text-white py-2 px-4 rounded font-normal hover:text-opacity-75 animated-underline border border-gray-600 focus:outline-none focus-visible:text-white'
            >
              Pay {parseCommissionAmount(data.agreement).value}
            </button>
          );

          const acceptDeclineButtons = (
            <>
              <div className='mb-2'>
                <Button
                  variants='primary'
                  className='text-xs mr-2'
                  onClick={(e) => handleAcceptByBusiness(data)}
                >
                  Accept
                </Button>
              </div>
              <div>
                <Button
                  variants='secondary'
                  className='text-xs'
                  onClick={(e) => handleDeclineByBusiness(data)}
                >
                  Decline
                </Button>
              </div>
            </>
          );

          const rateButton = (
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleRate(data)}
              >
                Rate
              </Button>
            </div>
          );

          const cancelByGuruButton = (
            <div>
              <Button
                variants='primary'
                className='text-xs'
                onClick={(e) => handleCancelByGuru(data)}
              >
                Cancel
              </Button>
            </div>
          );

          const isGuru = data.guru.userId === userProfile?.userId;
          const isAgreementFixed =
            data.agreement.commissionType === CommissionType.fixed;
          let initialRating;
          let ratingLength = 0;
          // if ('review' in data) {
          //   ratingLength = data.review.length;
          //   initialRating = ratingLength > 0 ? data.review[0].rating : 1;
          // }

          const rateStars = data.guru.userId === userProfile?.userId && (
            <Rating
              initialValue={initialRating}
              // editing={false}
              onStarClick={(e) => handleRate(data)}
            />
          );

          // guru actions
          if (isGuru) {
            if (data.status !== IntroductionStatus.CANCELLED) {
              return (
                <div className='flex justify-end space-x-1'>
                  {cancelByGuruButton}
                </div>
              );
            }
          }

          // business
          return (
            <div className='flex justify-end space-x-1'>
              {data.status === IntroductionStatus.PENDING &&
                acceptDeclineButtons}
              {data.status === IntroductionStatus.ACCEPTED && completeButton}
            </div>
          );
        },
      },
    ],
    [errorMessage, modal, introductions]
  );

  const toggleIntroductions = async (value) => {
    // user didn't set the terms
    if (value) {
      return setShowAgreementModal(true);
    } else {
      if (userProfile) {
        const data = await updateUserProfile.run({
          ...userProfile,
          isAcceptingIntroductions: false,
        });
        if (data) {
          userProfileStore.setState({ userProfile: data });
        }
      }
    }
  };

  const agreementAmount = useMemo(
    () =>
      (rowItem?.agreement && parseCommissionAmount(rowItem?.agreement)) || null,
    [rowItem]
  );

  const closePaymentSummaryModal = () => setShowPaymentSummaryModal(false);
  const redirectToStripe = async () => {
    setErrorMessage('');
    if (!agreementAmount?.isFixed && !inputRef.current.value) {
      return setErrorMessage('Please enter deal value');
    }
    if (rowItem?._id) {
      if (!agreementAmount?.isFixed) {
        await updateIntroduction.run({
          _id: rowItem?._id,
          dealValue: inputRef.current.value,
        });
      }
      const paymentSession = await getPaymentSession.run(rowItem?._id);
      if (!paymentSession) {
        return toast.error(
          'There is a problem with the quote or payment! Please contact us.'
        );
      }
      window.location.href = `${paymentSession?.url}`;
    }
  };

  console.log(quote);

  return (
    <DefaultLayout>
      <div className='max-w-7xl mx-auto my-8 mb-16'>
        <div className='py-4 flex justify-between'>
          <div className='text-2xl'>All introductions</div>
          <div className='flex justify-end'>
            <Toggle
              label='Accept introductions'
              value={Boolean(userProfile?.isAcceptingIntroductions)}
              onChange={toggleIntroductions}
              description={
                userProfile?.isAcceptingIntroductions ? 'Active' : 'Turned off'
              }
            />

            <Link href={'/'}>
              <a className='ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                New Introduction
              </a>
            </Link>
          </div>
        </div>

        <Table
          columns={columns}
          data={introductions}
          isLoading={searchIntroductions.isLoading}
        />

        <div>
          <Modal
            isShowing={showAgreementModal}
            caption={'Advertise your business to gurus'}
            acceptCaption='Save'
            cancelCaption='Close'
            onCancel={() => setShowAgreementModal(false)}
            form='commission'
            content={
              <ProfileForm
                id='commission'
                onSuccess={(data) => {
                  userProfileStore.setState({ userProfile: data });
                  setShowAgreementModal(false);
                  toast.success(
                    data.isAcceptingIntroductions
                      ? 'Success! Your business is now open for business.'
                      : 'Your business profile is now hidden'
                  );
                }}
              />
            }
          />
          <Modal
            isShowing={showPaymentSummaryModal}
            isLoading={getQuoteRequest.isLoading || getPaymentSession.isLoading}
            caption={'Your payment summary'}
            acceptCaption='Continue'
            cancelCaption='Close'
            form='commission'
            size='sm'
            onCancel={closePaymentSummaryModal}
            onAccept={redirectToStripe}
          >
            <div>
              <p>
                Your Guru {rowItem?.business.businessName} will receive{' '}
                {quote?.amountOwned?.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                })}
                .
              </p>
              {!agreementAmount?.isFixed && (
                <div className='mt-4'>
                  <div className='mx-auto'>
                    Please enter a value of a deal:
                    <input
                      type='number'
                      value={dealValue || ''}
                      defaultValue={rowItem?.agreement.dealValue}
                      onChange={(e) => setDealValue(Number(e.target.value))}
                      className='w-full'
                    />
                  </div>
                </div>
              )}
              {!agreementAmount?.isFixed && (
                <div className='mt-4'>
                  Payable to guru:{' '}
                  <span className='text-green-600'>
                    {quote?.amountOwned?.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                    })}
                  </span>
                </div>
              )}
              <p>
                Our fee:{' '}
                {quote?.introduceGuruFee?.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                })}
                .
              </p>
              {errorMessage && (
                <div className='mt-4'>
                  <InlineError message={errorMessage} />
                </div>
              )}
            </div>
          </Modal>
          <Modal
            isShowing={Boolean(modal?.show)}
            isLoading={Boolean(modal?.isLoading)}
            acceptCaption={modal?.acceptCaption}
            cancelCaption={modal?.cancelCaption}
            caption={modal?.caption}
            onAccept={modal.onAccept}
            onCancel={modal.onCancel}
            size={modal?.size}
          >
            <div>
              {modal.content}
              {errorMessage && (
                <div className='mt-4'>
                  <InlineError message={errorMessage} />
                </div>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </DefaultLayout>
    // </DashboardLayout>
  );
}
