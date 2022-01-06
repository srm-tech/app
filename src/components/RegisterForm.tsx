import { useRef, useState } from 'react';
import { Switch } from '@headlessui/react';
import useFetch from 'use-http';
import { handleError } from '@/lib/helper';
import InlineError from './errors/InlineError';
import Link from 'next/link';

interface Profile {
  contactEmail: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  businessName: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function RegisterForm({
  email,
  onComplete,
}: {
  email?: string;
  onComplete: (props: any) => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const formRef = useRef<any>();
  const { put, response } = useFetch('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState<Profile>({
    contactEmail: email || '',
    contactPhone: '',
    firstName: '',
    lastName: '',
    businessName: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!agreed) {
      return setErrorMessage('Please agree to our terms.');
    }
    await put('/me/register', profile);
    handleError(response, setErrorMessage);
    if (response.ok) {
      onComplete(e);
    }
  };

  return (
    <div className='text-left bg-white px-4 overflow-hidden sm:px-6 lg:px-8'>
      <div className='relative max-w-xl mx-auto'>
        <div className='mt-12'>
          <form
            ref={formRef}
            id='registration'
            onSubmit={submit}
            className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8'
          >
            <div>
              <label
                htmlFor='first-name'
                className='block text-sm font-medium text-gray-700'
              >
                First name
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  autoComplete='given-name'
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className='py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='last-name'
                className='block text-sm font-medium text-gray-700'
              >
                Last name
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className='py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='company'
                className='block text-sm font-medium text-gray-700'
              >
                Company
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='company'
                  id='company'
                  autoComplete='organization'
                  value={profile.businessName}
                  onChange={(e) =>
                    setProfile({ ...profile, businessName: e.target.value })
                  }
                  className='py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Contact Email
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  value={profile.contactEmail}
                  onChange={(e) =>
                    setProfile({ ...profile, contactEmail: e.target.value })
                  }
                  className='py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='phone-number'
                className='block text-sm font-medium text-gray-700'
              >
                Contact Phone Number
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                {/* <div className='absolute inset-y-0 left-0 flex items-center'>
                  <label htmlFor='country' className='sr-only'>
                    Country
                  </label>
                  <select
                    id='country'
                    name='country'
                    className='h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md'
                  >
                    <option>US</option>
                    <option>CA</option>
                    <option>EU</option>
                  </select>
                </div> */}
                <input
                  type='text'
                  name='phone-number'
                  id='phone-number'
                  autoComplete='tel'
                  value={profile.contactPhone}
                  onChange={(e) =>
                    setProfile({ ...profile, contactPhone: e.target.value })
                  }
                  className='py-2 px-4 block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
                  placeholder='+1 (555) 987-6543'
                />
              </div>
            </div>
            {/* <div className='sm:col-span-2'>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700'
              >
                Message
              </label>
              <div className='mt-1'>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  className='py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md'
                  defaultValue={''}
                />
              </div>
            </div> */}
            <div className='sm:col-span-2'>
              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <Switch
                    checked={agreed}
                    onChange={setAgreed}
                    className={classNames(
                      agreed ? 'bg-indigo-600' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    )}
                  >
                    <span className='sr-only'>Agree to policies</span>
                    <span
                      aria-hidden='true'
                      className={classNames(
                        agreed ? 'translate-x-5' : 'translate-x-0',
                        'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>
                <div className='ml-3'>
                  <p className='text-base text-gray-500'>
                    By selecting this, you agree to the{' '}
                    <Link href='/legal/privacy' passHref>
                      <a className='font-medium text-gray-700 underline'>
                        Privacy Policy
                      </a>
                    </Link>{' '}
                    and{' '}
                    <Link href='/legal/terms' passHref>
                      <a className='font-medium text-gray-700 underline'>
                        Terms & Conditions
                      </a>
                    </Link>
                    .
                  </p>
                </div>
              </div>
              {errorMessage && (
                <div className='py-4'>
                  <InlineError message={errorMessage} />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
