import { UserProfile } from '../userProfile1/UserProfileModel';

export type DefaultProfile = Omit<UserProfile, '_id' | 'userId'>;

export const defaultProfile: DefaultProfile = {
  firstName: '',
  lastName: '',
  fullName: '',
  contactEmail: '',
  contactPhone: '',
  businessName: '',
  businessCategory: '',
  stripeId: '',
  accountLink: '',
  address1: '',
  address2: '',
  address3: '',
  abn: '',
  country: '',
  rating: 0,
  successfulRate: 0,
  averageCommission: 0,
  commissionCurrency: 'AUD',
  commissionType: '',
  commissionValue: 0,
  commissionPerReceivedLead: 0,
  commissionPerCompletedLead: 0,
  commissionPerCompletedLeadPercent: 0,
  isAcceptingIntroductions: false,
  isActive: false,
  isComplete: false,
};
