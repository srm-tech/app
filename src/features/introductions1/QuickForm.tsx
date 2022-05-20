import { ExclamationIcon, UserIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import * as React from 'react';
import toast from 'react-hot-toast';
import useFetch from 'use-http';

import { handleError } from '@/lib/helper';
import useRequest from '@/lib/useRequest';

import ComboSelect, { ComboSearch } from '@/components/ComboSelect';
import ContactType from '@/components/ContactTypeSelect';
import InlineError from '@/components/errors/InlineError';
import Modal from '@/components/modals/ConfirmModal';

import type {
  Agreement,
  AgreementInput,
  Commission,
} from '@/features/agreements/AgreementModel';
import {
  AgreementSummaryForGuru,
  DefaultAgreementSummaryForGuru,
} from '@/features/agreements/AgreementSummary';
import { useSession } from '@/features/session/SessionContext';
import RegisterForm from '@/features/userProfile1/RegisterForm';
import userProfileApi from '@/features/userProfile1/requests';

import { Introduction, IntroductionInput } from './IntroductionModel';
import introductionApi from './requests';
import { CommissionPaymentType } from '../agreements/agreementConstants';
import agreementApi from '../agreements/requests';
import { BusinessSearch, UserProfile } from '../userProfile1/UserProfileModel';
import userProfileStore from '../userProfile1/userStore';
export interface Search {
  _id: string;
  label: string;
  businessName: string;
  category: string;
}

export interface Customer {
  contact: string;
  name: string;
  contactType: string;
}
export interface Business {
  _id: string;
  name: string;
  company: string;
}
export interface Draft {
  _id?: string;
  customer: Customer;
  business: Business;
}

const initialCustomer = {
  contact: '',
  name: '',
  contactType: 'phone',
};

export const QuickForm = () => {
  const router = useRouter();
  const {
    data: sessionData,
    signIn,
    signOut,
    showLoginModal,
    ...session
  } = useSession();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [query, setQuery] = React.useState<string>('');
  const [customer, setCustomer] = React.useState<Customer>(initialCustomer);
  const [step, setStep] = React.useState(router.query.step || 1);

  const userProfile = userProfileStore((state) => state.userProfile);
  const { data: businessList, ...searchUserProfile } = useRequest<
    UserProfile[],
    { q: string }
  >(userProfileApi.searchUserProfile, {
    payload: { q: query },
    dependencies: [query],
    debounce: 400,
  });

  const [comboItem, setComboItem] = React.useState<ComboSearch | null>(null);
  const comboInputs: ComboSearch[] = useMemo(
    () =>
      businessList?.map((item: BusinessSearch) => ({
        _id: item.userId,
        label: item.fullName,
        description: `${item.businessName} | ${item.businessCategory}`,
      })) || [],
    [businessList]
  );
  const business = useMemo(
    () => businessList?.find((item) => item.userId === comboItem?._id),
    [comboItem, businessList]
  );
  const { data: defaultAgreement } = useRequest<
    Commission,
    { businessId: string }
  >(userProfileApi.getUserProfileCommission, {
    payload: { businessId: business?.userId || '' },
    dependencies: [business?.userId],
  });

  const { data: newAgreement, ...createAgreement } = useRequest<
    Agreement,
    AgreementInput
  >(agreementApi.createAgreement);
  const { data: agreement, ...searchAgreement } = useRequest<
    Agreement,
    AgreementInput
  >(agreementApi.searchAgreement, {
    payload: {
      businessId: `${business?.userId}`,
      guruId: `${userProfile?.userId}`,
    },
    dependencies: [userProfile?.userId, business?.userId, newAgreement],
  });
  const createIntroduction = useRequest<Introduction, IntroductionInput>(
    introductionApi.createIntroduction
  );

  const changeBusiness = useCallback((inputValue) => {
    setQuery(inputValue);
  }, []);

  const selectBusiness = (result: ComboSearch | null) => {
    setComboItem(result);
  };

  const acceptAgreement = async (e) => {
    setErrorMessage('');
    if (!agreement) {
      await createAgreement.run({
        businessId: `${business?.userId}`,
        guruId: `${userProfile?.userId}`,
      });
    }
    if (createAgreement.error) {
      return setErrorMessage("Oops, we couldn't create an agreement.");
    }
    const introduction = await createIntroduction.run({
      businessId: `${business?.userId}`,
      guruId: `${userProfile?.userId}`,
      agreementId: `${agreement?._id}`,
      customer,
    });

    if (!introduction?._id) {
      return setErrorMessage("Oops, we couldn't create an introduction.");
    }
    setStep(1);
    setIsLoading(false);
    toast.success(
      `Success! Your introduction has been sent to ${business?.businessName}`
    );
    setQuery('');
    setCustomer(initialCustomer);
  };

  const introduce = (
    isBusinessSelected,
    isActiveSession,
    isActiveUserProfile,
    isAgreed
  ) => {
    setErrorMessage('');
    setIsLoading(true);

    // // need existing business id
    if (!isBusinessSelected) {
      setIsLoading(false);
      return setErrorMessage(
        'Business not found. Please select it from the dropdown.'
      );
    }

    // user not logged?
    if (!isActiveSession) {
      setIsLoading(false);
      return showLoginModal();
    }

    // user not registered fully (no UserProfile) -> show dialog
    if (!isActiveUserProfile) {
      setIsLoading(false);
      return setStep(3);
    }

    if (!isAgreed) {
      setIsLoading(false);
      return setStep(4);
    }
    setStep(4);
    // show agreement summary so guru accepts the conditions
    // same contract as it comes from the contacts (user agreed to it before connecting with business)
    // this agreement is then attached to the introduction
    // await get(`/myContacts/${draft.business._id}`);
    // if (response.ok) {
    //   // already a contact, feed in the agreement
    //   if (response.data) {
    //     setAgreement(response.data.agreement);
    //   } else {
    //     // not yet a contact, agree to default contract and user to contacts
    //     await get(`/business/${draft.business._id}/defaultAgreement`);
    //     if (response.ok && response.data) {
    //       setAgreement({ ...response.data, agreedAt: new Date() });
    //     }
    //   }
    //   return setStep(4);
    // }
  };

  const isBusinessSelected = business?.userId;
  const isActiveSession = session.isActive;
  const isActiveUserProfile = userProfile?.isActive;
  const isAgreed = Boolean(agreement);

  return (
    <div className='m-auto bg-white rounded-lg sm:max-w-md sm:w-full'>
      <form
        className='space-y-6'
        onSubmit={(e) => {
          e.preventDefault();
          introduce(
            isBusinessSelected,
            isActiveSession,
            isActiveUserProfile,
            isAgreed
          );
        }}
      >
        <div className='flex flex-col'>
          <div className='px-8 pt-4'>
            <label className='text-base font-medium text-gray-900'>
              Quick Introduction
            </label>
          </div>{' '}
          <div className='flex px-8 py-4'>
            <img
              src='/home/img/introduceTo.svg'
              alt='introducing'
              className='w-20 h-20 mr-2'
            />
            <div className='flex-1'>
              <p className='text-sm leading-5 text-gray-500'>
                Introducing trusted partner:
              </p>
              <label htmlFor='name' className='sr-only'>
                Contact list
              </label>
              <ComboSelect
                inputItems={comboInputs}
                isLoading={searchUserProfile.isLoading}
                error={searchUserProfile.error}
                query={query}
                value={comboItem}
                onChange={changeBusiness}
                onSelect={selectBusiness}
              />
            </div>
          </div>
          <hr />
          <div className='flex px-8 py-4'>
            <div className='flex-1 space-y-2'>
              <div className=''>
                <p className='text-sm leading-5 text-gray-500'>To client:</p>
                <label htmlFor='name' className='sr-only'>
                  Introduce to (name)
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  autoComplete='name'
                  placeholder='Joe Doe'
                  required
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  value={customer.name}
                  onChange={(event) =>
                    setCustomer({ ...customer, name: event.target.value })
                  }
                />
              </div>
              <div className='flex'>
                <ContactType
                  onChange={(contactType) =>
                    setCustomer({ ...customer, contactType })
                  }
                  value={customer.contactType}
                />
                <input
                  type={customer.contactType === 'email' ? 'email' : 'text'}
                  name='contact'
                  id='contact'
                  autoComplete='contact'
                  placeholder={
                    customer.contactType === 'email'
                      ? 'contact email'
                      : 'contact phone'
                  }
                  required
                  className='block w-full ml-3 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  value={customer.contact}
                  onChange={(event) =>
                    setCustomer({ ...customer, contact: event.target.value })
                  }
                />
              </div>
            </div>
            <img
              src='/home/img/introducing.svg'
              alt='introducing'
              className='w-20 h-20 mt-4'
            />
          </div>
          {errorMessage && (
            <div className='px-8 py-4'>
              <InlineError message={errorMessage} />
            </div>
          )}
          <div className='px-8 py-4'>
            <button
              type='submit'
              // disabled={isLoading}
              className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-400 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              {isLoading ? 'sending...' : 'Introduce'}
            </button>
          </div>
          {!session.isActive && (
            <div className='px-4 py-6 border-t-2 sm:px-10'>
              <p className='text-xs leading-5 text-gray-500'>
                <button
                  onClick={showLoginModal}
                  className='font-medium text-blue-500 hover:underline'
                >
                  Sign In
                </button>{' '}
                to save and track introductions.
              </p>
            </div>
          )}
        </div>
      </form>

      <Modal
        isShowing={step === 2}
        acceptCaption='Sign In'
        onAccept={showLoginModal}
        onCancel={() => setStep(1)}
        icon={
          <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10'>
            <UserIcon className='h-6 w-6 text-yellow-600' aria-hidden='true' />
          </div>
        }
        caption='Not logged in?'
        content={<p>To save introduction please sign.</p>}
      />
      <Modal
        isShowing={step === 3}
        form='registration'
        acceptCaption='Register Now'
        cancelCaption='Close'
        onAccept={() => console.info('register from intro')}
        onCancel={() => setStep(1)}
        caption='Register for an account'
        content={
          <div>
            <p>
              Almost there, please provide profile info for the introduction.
            </p>
            <RegisterForm
              id='registration'
              onSuccess={(data) => {
                toast.success(`Success! Welcome ${data?.firstName}!`);
                userProfileStore.setState({ userProfile: data });
                introduce(
                  isBusinessSelected,
                  isActiveSession,
                  data.isActive,
                  isAgreed
                );
              }}
            />
          </div>
        }
      />
      <Modal
        isShowing={step === 4}
        isLoading={createIntroduction.isLoading}
        acceptCaption='Accept & Introduce'
        cancelCaption='Decline'
        onAccept={acceptAgreement}
        onCancel={() => {
          setStep(1);
          setIsLoading(false);
        }}
        caption={`Review your agreement with ${business?.businessName}`}
        content={
          <div>
            {agreement ? (
              <AgreementSummaryForGuru
                business={business}
                agreement={agreement}
              />
            ) : (
              <DefaultAgreementSummaryForGuru
                business={business}
                defaultAgreement={defaultAgreement}
              />
            )}
            {errorMessage && (
              <div className='mt-4'>
                <InlineError message={errorMessage} />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};
