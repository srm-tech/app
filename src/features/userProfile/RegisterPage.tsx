import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import DefaultLayout from '@/layouts/Default';

import RegisterForm from './RegisterForm';
import userProfileStore from './userStore';

interface Profile {
  contactEmail: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  businessName: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const userProfile = userProfileStore((state) => state.userProfile);
  return (
    <DefaultLayout>
      <div className='px-4 mx-auto my-8 mb-16 max-w-2xl'>
        <div>
          <p>Almost there, please provide profile info for the introduction.</p>
          <RegisterForm
            id='registration'
            onSuccess={(data) => {
              toast.success(`Success! Welcome ${data?.firstName}!`);
              userProfileStore.setState({ userProfile: data });
              router.replace('/');
            }}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
