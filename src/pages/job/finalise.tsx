import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from 'use-http';

import { formatCommissionDescriptions } from '@/lib/utils';

import Link from '@/components/buttons/Link';
import DashboardLayout from '@/layouts/DashboardLayout';

import { env } from '@/lib/envConfig';
import UserProfile from '@/models/UserProfiles';

interface IFormInput {
  revenue: number;
  reward: number;
  tip: number;
  total: number;
  guruFee: number;
  commissionType: string;
  commissionValue: number;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      jobId: query.jobId,
    },
  };
};

export default function Finalise(props) {
  // todo: do it better, please. I have done this quickly and dirty, and feel bad about it :'(
  function calculate(values: IFormInput) {
    if (values.commissionType === 'commissionPerReceivedLeadPercent') {
      values.reward = (values.revenue * values.commissionValue) / 100;
    }
    values.guruFee = (values.reward + values.tip) * Number(env.TRANSACTION_FEE);
    values.total = values.reward + values.tip + values.guruFee;

    return values;
  }

  function processForm(data) {
    const revenue: number = isNaN(parseFloat(data.revenue.value))
      ? 0
      : parseFloat(data.revenue.value);
    const reward: number = isNaN(parseFloat(data.reward.value))
      ? 0
      : parseFloat(data.reward.value);
    const tip: number = isNaN(parseFloat(data.tip.value))
      ? 0
      : parseFloat(data.tip.value);
    const guruFee: number = isNaN(parseFloat(data.guruFee.value))
      ? 0
      : parseFloat(data.guruFee.value);
    const total: number = isNaN(parseFloat(data.total.value))
      ? 0
      : parseFloat(data.total.value);
    const commissionType: string = data.commissionType.value;
    const commissionValue: number = isNaN(
      parseFloat(data.commissionValue.value)
    )
      ? 0
      : parseFloat(data.commissionValue.value);
    let values = {
      revenue: revenue,
      reward: reward,
      tip: tip,
      guruFee: guruFee,
      total: total,
      commissionType: commissionType,
      commissionValue: commissionValue,
    };

    values = calculate(values);

    data.reward.value = values.reward.toFixed(2);
    data.guruFee.value = values.guruFee.toFixed(2);
    data.total.value = values.total.toFixed(2);
    return values;
  }

  function handleChange(e) {
    const data = e.target.form.elements;
    processForm(data);
  }

  const initialJobData: any = null;
  const initialAgreement = {
    key: null as any,
    value: null as any,
  };

  const [loaderVisible, setLoaderVisible] = useState(false);

  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [jobData, setJobData] = useState(initialJobData);
  const [mailSent, setMailSent] = useState(false);
  const [agreement, setAgreement] = useState(initialAgreement);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const { get, post, response, loading, error } = useFetch(
    process.env.BASE_URL
  );

  async function loadData() {
    const loaded = await get(`/api/job/finalise?jobId=${props.jobId}`);
    let data: IFormInput = {
      commissionType: '',
      commissionValue: 0,
      revenue: 0,
      reward: 0,
      guruFee: 0,
      tip: 0,
      total: 0,
    };

    if (loaded) {
      if (
        loaded.agreement.commissionType === 'commissionPerReceivedLead' ||
        loaded.agreement.commissionType === 'commissionPerCompletedLead'
      ) {
        data.reward = loaded.agreement.commissionValue;
      }
      data.commissionType = loaded.agreement.commissionType;
      data.commissionValue = loaded.agreement.commissionValue;
    }
    data = calculate(data);
    setJobData(loaded);
    setAgreement(formatCommissionDescriptions(loaded.agreement));
    console.log(agreement);
    reset(data);
  }

  useEffect(() => {
    loadData();
  }, [reset]);

  function handleFormClick(e) {
    const formData = e.target.form.elements;
    const data = processForm(formData);
    saveData(data);
  }

  async function saveData(data) {
    setSavedMessage(false);
    setErrorMessage(false);
    setMailSent(false);
    setErrorMessageText('');

    // told ya I've done this dirty?
    data.reward = parseFloat(data.reward);
    data.tip = parseFloat(data.tip);
    data.guruFee = (data.reward + data.tip) * Number(env.TRANSACTION_FEE);

    const amount = data.reward + data.tip + data.guruFee;

    const paymentData = {
      amount: amount,
      fee: data.guruFee,
      jobId: props.jobId,
      stripeId: jobData.fresh.stripeId,
    };

    if (!paymentData.stripeId) {
      // the Guru doesn't have the Stripe account connected
      const result = await post('/api/job/sendMail', {
        jobId: paymentData.jobId,
        amount: paymentData.amount,
      });
      if (result.statusCode === 200) {
        setMailSent(true);
      } else {
        setErrorMessage(true);
        setErrorMessageText(result.message);
      }
    } else {
      // the Guru does have the Stripe connected
      const result = await post('/api/job/makePayment', {
        jobId: paymentData.jobId,
        amount: paymentData.amount,
        fee: paymentData.fee,
      });
      if (result.statusCode !== 200) {
        setErrorMessage(true);
        setErrorMessageText(result.message);
      } else {
        window.location.href = result.url;
      }
    }
  }

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);
  return (
    <>
      <DashboardLayout loading={loading}>
        <form
          method='post'
          onSubmit={(e) => e.preventDefault()}
          onChange={(e) => handleChange(e)}
        >
          <div className='user-form'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              {/* left panel */}
              <div className='p-4 text-white bg-green-800 md:col-span-1'>
                <div className='px-4 sm:px-0'>
                  <h1 className='text-lg font-medium leading-6'>Review job</h1>
                  <p className='pt-4 mt-1 text-sm'>
                    <strong>Your agreement:</strong>
                  </p>
                  <p className='mt-1 text-sm'>
                    {agreement.key}: {agreement.value}
                  </p>
                </div>
              </div>

              {/* right panel */}
              <div className='p-4 mt-5 md:mt-0 md:col-span-2'>
                {/* error message */}
                {errorMessage && (
                  <div className='relative bg-red-100'>
                    <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                      <div className='pr-16 sm:text-center sm:px-16'>
                        <p className='font-medium text-red-400'>
                          Uh, oh! A problem occured while processing your
                          payment!
                        </p>
                        <p className='text-red-400'>
                          <small>{errorMessageText}</small>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of error message */}
                {/* ok message */}
                {savedMessage && (
                  <div className='relative bg-green-800'>
                    <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                      <div className='pr-16 sm:text-center sm:px-16'>
                        <p className='font-medium text-white'>
                          <span>Your payment was successful</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of ok message */}
                {/* sent mail  message */}
                {mailSent && (
                  <div className='relative bg-green-800'>
                    <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                      <div className='pr-16 sm:text-center sm:px-16'>
                        <p className='font-medium text-white'>
                          <span>
                            Your Guru hasn't got his/hers Stripe account yet. We
                            have to wait for him to create one.
                            <Link href='/introductions'>
                              {' '}
                              Click here to return to introductions page.
                            </Link>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of sent mail message */}

                <div className='space-y-8 divide-y divide-gray-200'>
                  <div>
                    <div className='grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6'>
                      {/* Revenue field starts here */}
                      <div className='sm:col-span-4'>
                        <label
                          htmlFor='revenue'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Revenue:
                        </label>
                        <div className='flex mt-1 rounded-md shadow-sm'>
                          <input
                            type='number'
                            step='0.01'
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            {...register('revenue', {
                              required: true,
                            })}
                          />
                        </div>

                        {errors.revenue?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                      {/* Revenue field ends here */}

                      {/* Reward field starts here */}
                      <div className='sm:col-span-4'>
                        <label
                          htmlFor='revenue'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Reward:
                        </label>
                        <div className='flex mt-1 rounded-md shadow-sm'>
                          <input
                            type='number'
                            step='0.01'
                            disabled={true}
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            {...register('reward', {
                              required: true,
                            })}
                          />
                        </div>

                        {errors.reward?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                      {/* Reward field ends here */}

                      {/* Tip / bonus field starts here */}
                      <div className='sm:col-span-4'>
                        <label
                          htmlFor='revenue'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Tip / bonus:
                        </label>
                        <div className='flex mt-1 rounded-md shadow-sm'>
                          <input
                            type='number'
                            step='0.01'
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            {...register('tip', {
                              required: true,
                            })}
                          />
                        </div>

                        {errors.tip?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                      {/* Tip / bonus field ends here */}

                      {/* Guru fees field starts here */}
                      <div className='sm:col-span-4'>
                        <label
                          htmlFor='guruFee'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Introduce.guru fee:
                        </label>
                        <div className='flex mt-1 rounded-md shadow-sm'>
                          <input
                            disabled={true}
                            defaultValue={0}
                            type='number'
                            step='0.01'
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            {...register('guruFee', {
                              required: false,
                            })}
                          />
                        </div>

                        {errors.guruFee?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                      {/* Tip / bonus field ends here */}

                      {/* Total field starts here */}
                      <div className='sm:col-span-4'>
                        <label
                          htmlFor='revenue'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Total payment:
                        </label>
                        <div className='flex mt-1 rounded-md shadow-sm'>
                          <input
                            disabled={true}
                            type='number'
                            className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                            {...register('total')}
                          />
                        </div>

                        {errors.tip?.type === 'required' && (
                          <small className='text-red-900'>
                            This field is required
                          </small>
                        )}
                      </div>
                      {/* Total field ends here */}

                      {/* Agreement part starts here */}
                      {/* todo: make them hidden */}
                      <div className='sm:col-span-4'>
                        <input
                          type='hidden'
                          disabled={true}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                          {...register('commissionType')}
                        />
                        <input
                          type='hidden'
                          disabled={true}
                          className='flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
                          {...register('commissionValue')}
                        />
                      </div>
                      {/* Agreement part ends here */}
                    </div>
                    <div className='pt-5'>
                      <div className='flex justify-end'>
                        {!mailSent && (
                          <button
                            type='submit'
                            onClick={(e) => handleFormClick(e)}
                            className='inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* right panel ends here */}
            </div>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}
