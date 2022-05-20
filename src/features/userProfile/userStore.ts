import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { UserProfile } from './UserProfileModel';

interface UserState {
  isLoading: boolean;
  userProfile: UserProfile | undefined;
}

const userProfileStore = create<UserState>()(
  devtools((set) => ({
    isLoading: true,
    userProfile: undefined,
  }))
);

export default userProfileStore;
