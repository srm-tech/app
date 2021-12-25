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

export interface Query {
  _id: string;
  label: string;
  businessName: string;
  category: string;
}
export interface Draft {
  _id?: string;
  contact: string;
  contactName: string;
  contactType: string;
  businessId: string;
  businessName: string;
  businessLabel: string;
}

export interface Agreement {
  commissionPerReceivedLeadCash: number;
  commissionPerCompletedLead: number;
  commissionPerReceivedLeadPercent: number;
  agreedAt?: Date;
}

export const QuickForm = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const [businessError, setBusinessError] = React.useState('');
  const [query, setQuery] = React.useState<string>('');
  const [agreement, setAgreement] = React.useState<Agreement>({
    commissionPerReceivedLeadCash: 0,
    commissionPerCompletedLead: 0,
    commissionPerReceivedLeadPercent: 0,
  });
  const [draft, setDraft] = React.useState<Draft>({
    contact: '',
    contactName: '',
    contactType: 'phone',
    businessId: '',
    businessName: '',
    businessLabel: query || '',
  });
  const [profile, setProfile] = React.useState<{ email: string }>({
    email: '',
  });

  const router = useRouter();
  const [step, setStep] = React.useState(router.query.step || 1);
  const { data: session } = useSession();
  const formRef = React.useRef<any>();
  const { post, get, put, response, loading, error } = useFetch('/');

  const loadData = async () => {
    const result = await get(`/drafts/${router.query.draftId}`);
    setQuery(result.businessLabel);
    setDraft(result);
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
      if (!draft.businessId) {
        return setErrorMessage(
          'Business not found. Please select it from the dropdown.'
        );
      }

      // always save draft
      if (draft._id) {
        await put(`/drafts/${draft._id}`, draft);
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

      // user logged in but not registered -> show dialog
      await get('/me');
      setProfile({ email: response.data?.email });
      if (response.ok && !response.data?.isActive) {
        return setStep(3);
      }

      // users not connected -> show agreement
      await get(`/myContacts/${draft.businessId}`);
      if (response.ok && !response.data) {
        await get(`/business/${draft.businessId}/defaultAgreement`);
        if (response.ok && response.data) {
          setAgreement(response.data);
        }
        return setStep(4);
      }

      // final introduction
      await post('/introductions', draft);
      if (response.ok) {
        router.push('/dashboard');
      }
      handleError(response, setErrorMessage);
    },
    [draft]
  );

  const changeBusiness = React.useCallback(
    (inputValue) => {
      setQuery(inputValue);
      if (draft.businessId && inputValue !== draft.businessLabel) {
        setDraft({ ...draft, businessId: '' });
      }
    },
    [draft]
  );

  const resubmit = () => (e) => {
    setStep(1);
    _handleSubmit(e);
  };

  const acceptAgreement = async (e) => {
    // just create contact for now with a copy of a agreement and timestamp
    // agreement need to be able to be updated in the future so we add status isActive
    setErrorMessage('');
    await post(`/myContacts`, { contactId: draft.businessId, agreement });
    if (response.ok && response.data) {
      setStep(1);
      _handleSubmit(e);
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
                onSelect={(result: Query) => {
                  setDraft({
                    ...draft,
                    businessId: result._id,
                    businessLabel: result.label,
                    businessName: result.businessName,
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
                  value={draft.contactName}
                  onChange={(event) =>
                    setDraft({ ...draft, contactName: event.target.value })
                  }
                />
              </div>
              <div className='flex'>
                <ContactType
                  onChange={(contactType) =>
                    setDraft({ ...draft, contactType })
                  }
                  value={draft.contactType}
                />
                <input
                  type={draft.contactType === 'email' ? 'email' : 'text'}
                  name='contact'
                  id='contact'
                  autoComplete='contact'
                  placeholder={
                    draft.contactType === 'email'
                      ? 'contact email'
                      : 'contact phone'
                  }
                  required
                  className='ml-3  block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  value={draft.contact}
                  onChange={(event) =>
                    setDraft({ ...draft, contact: event.target.value })
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
        accept={() => console.info('register')}
        cancel={() => setStep(1)}
        caption='New to Introduce Guru?'
        content={
          <div>
            <p>
              Almost there, please provide profile info for the introduction.
            </p>
            <RegisterForm email={profile.email} onComplete={resubmit} />
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
        caption={`Your contract with ${draft.businessLabel}`}
        content={
          <div>
            <p>
              {draft.businessLabel} would like to offer you the following
              incentives:
            </p>
            <div>
              Commission for received introduction:{' '}
              {agreement.commissionPerReceivedLeadCash.toLocaleString('en-AU', {
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
            </div>
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
