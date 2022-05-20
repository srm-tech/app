import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

import ConfirmModal from '@/components/modals/ConfirmModal';

import RegisterForm from './RegisterForm';
import { UserProfile } from './UserProfileModel';
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
    <ConfirmModal
      isShowing={true}
      form='registration'
      acceptCaption='Register Now'
      onAccept={() => console.info('register from intro')}
      onCancel={() => {}}
      caption='Create Introduce Guru account'
      isClosable={false}
      content={
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
      }
    />
  );
}
