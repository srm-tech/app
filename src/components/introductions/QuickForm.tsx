import * as React from 'react';
import useFetch from 'use-http';
import ContactType from './ContactTypeSelect';
import ComboSelect from '../ComboSelect';
import { useSession, signIn } from 'next-auth/react';
import InlineError from '../errors/InlineError';
import { handleErrors } from '@/lib/middleware';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Modal from '@/components/modals/ConfirmModal';
import RegisterForm from '../RegisterForm';
import { handleError } from '@/lib/helper';

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
export interface Agreement {
  commissionType: string;
  commissionValue: number;
  commissionCurrency: string;
  commissionLabel: string;
  agreedAt?: Date;
}
export interface Draft {
  _id?: string;
  customer: Customer;
  business: Business;
}

export const QuickForm = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const [query, setQuery] = React.useState<string>('');
  const [draftId, setDraftId] = React.useState<string | undefined>('');
  const [agreement, setAgreement] = React.useState<Agreement>({
    commissionType: '',
    commissionValue: 0,
    commissionCurrency: '',
    agreedAt: new Date(),
    commissionLabel: '',
  });
  const [customer, setCustomer] = React.useState<Customer>({
    contact: '',
    name: '',
    contactType: 'phone',
  });
  const [business, setBusiness] = React.useState<Business>({
    _id: '',
    name: query || '',
    company: '',
  });

  const [profile, setProfile] = React.useState<{ email: string }>({
    email: '',
  });

  const draft = {
    _id: draftId,
    customer,
    business,
    agreement,
  };

  const router = useRouter();
  const [step, setStep] = React.useState(router.query.step || 1);
  const { data: session } = useSession();
  const formRef = React.useRef<any>();
  const { post, get, put, response, loading, error } = useFetch('');

  const loadData = async () => {
    const result: Draft = await get(`/drafts/${router.query.draftId}`);
    setQuery(result.business.name);
    setCustomer(result.customer);
    setBusiness(result.business);
    setDraftId(result._id);
  };

  useEffect(() => {
    if (router.query.draftId) {
      loadData();
    }
  }, [router.query.draftId]);

  const _handleSubmit = React.useCallback(
    async (e) => {
      e?.preventDefault();
      setErrorMessage('');

      // need existing business id
      if (!business._id) {
        return setErrorMessage(
          'Business not found. Please select it from the dropdown.'
        );
      }

      // always save draft
      if (draftId) {
        await put(`/drafts/${draftId}`, draft);
      } else {
        await post('/drafts', draft);
      }

      // on draft insert push draft id to url for further callback redirect (auth)
      // and introduction retrieval
      if (response.ok && response.data?.insertedId) {
        router.query.draftId = response.data?.insertedId;
        router.push(router);
      }
      handleError(response, setErrorMessage);

      // user not logged in -> show dialog
      if (!session) {
        return setStep(2);
      }

      // user not registered fully (no UserProfile) -> show dialog
      await get(`/me`);
      if (response.ok && !response.data) {
        return setStep(3);
      }

      // show agreement summary so guru accepts the conditions
      // same contract as it comes from the contacts (user agreed to it before connecting with business)
      // this agreement is then attached to the introduction
      await get(`/myContacts/${draft.business._id}`);
      if (response.ok) {
        // already a contact, feed in the agreement
        if (response.data) {
          setAgreement(response.data.agreement);
        } else {
          // not yet a contact, agree to default contract and user to contacts
          await get(`/business/${draft.business._id}/defaultAgreement`);
          if (response.ok && response.data) {
            setAgreement({ ...response.data, agreedAt: new Date() });
          }
        }
        return setStep(4);
      }
    },
    [draft]
  );

  const changeBusiness = React.useCallback(
    (inputValue) => {
      setQuery(inputValue);
      if (business._id && inputValue !== business.name) {
        setBusiness({ ...business, _id: '' });
      }
    },
    [draft]
  );

  const resubmit = (e) => {
    setStep(1);
    _handleSubmit(e);
  };

  const acceptAgreement = async (e) => {
    // just create contact for now with a copy of a agreement and timestamp
    // agreement need to be able to be updated in the future so we add status isActive
    setErrorMessage('');
    await post(`/myContacts`, { contactId: business._id, agreement });
    if (response.ok && response.data) {
      // final introduction
      await post('/introductions', draft);
      if (response.ok) {
        router.push('/introductions');
      }
      handleError(response, setErrorMessage);
    }
    handleError(response, setErrorMessage);
  };

  return (
    <div className='bg-white rounded-lg sm:max-w-md sm:w-full m-auto'>
      <form ref={formRef} className='space-y-6' onSubmit={_handleSubmit}>
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
                query={query}
                onChange={changeBusiness}
                onSelect={(result: Search) => {
                  setBusiness({
                    ...business,
                    _id: result._id,
                    name: result.label,
                    company: result.businessName,
                  });
                }}
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
                  className='ml-3  block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
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
              disabled={loading}
              className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-400 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              {loading ? 'sending...' : 'Introduce'}
            </button>
          </div>
          {!session && (
            <div className='px-4 py-6 border-t-2 sm:px-10'>
              <p className='text-xs leading-5 text-gray-500'>
                <button
                  onClick={() =>
                    signIn('', {
                      callbackUrl: location.href,
                    })
                  }
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
        cancelCaption='I will do it later'
        accept={() =>
          signIn('', {
            callbackUrl: location.href,
          })
        }
        cancel={() => setStep(1)}
        caption='Not logged in?'
        content={<p>To save introduction please sign in with your email.</p>}
      />
      <Modal
        isShowing={step === 3}
        form='registration'
        acceptCaption='Register Now'
        cancelCaption='I will do it later'
        accept={() => console.info('register from intro')}
        cancel={() => setStep(1)}
        caption='New to Introduce Guru?'
        content={
          <div>
            <p>
              Almost there, please provide profile info for the introduction.
            </p>
            <RegisterForm
              email={profile.email}
              onComplete={(e) => resubmit(e)}
            />
          </div>
        }
      />
      <Modal
        isShowing={step === 4}
        form='registration'
        acceptCaption='Accept & Introduce'
        cancelCaption='Decline'
        accept={acceptAgreement}
        cancel={() => setStep(1)}
        caption={`Your contract summary`}
        content={
          <div>
            <p>
              {business.name} would like to offer you the following incentive:
            </p>
            <p>
              {agreement.commissionValue?.toLocaleString('en-AU', {
                style: 'currency',
                currency: agreement.commissionCurrency || 'AUD',
              })}
            </p>
            <p>for {agreement.commissionLabel}</p>
            {/* <div>
              Commission for received introduction:{' '}
              {agreement.commissionPerReceivedLead.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
              })}
            </div>
            <div>
              Commission on completed job (Fixed):{' '}
              {agreement.commissionPerCompletedLead.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
              })}
            </div>
            <div>
              Commission on completed job (Percent):{' '}
              {agreement.commissionPerReceivedLeadPercent.toLocaleString(
                'en-AU',
                { style: 'currency', currency: 'AUD' }
              )}
            </div> */}
            {errorMessage && (
              <div className='px-8 py-4'>
                <InlineError message={errorMessage} />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};
