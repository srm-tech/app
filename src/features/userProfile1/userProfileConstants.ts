import { UserProfile } from './UserProfileModel';
import {
  CommissionCurrency,
  CommissionPaymentType,
  CommissionType,
} from '../agreements/agreementConstants';

export const defaultProfile: Omit<UserProfile, '_id' | 'userId'> = {
  firstName: 'Kris',
  lastName: '',
  fullName: '',
  contactEmail: '',
  contactPhone: '',
  businessName: '',
  businessCategory: '',
  stripeId: '',
  addressLine1: '',
  addressLine2: '',
  abn: '',
  city: '',
  postcode: '',
  state: '',
  country: '',
  rating: 0,
  successfulRate: 0,
  averageCommission: 0,
  defaultCommission: [
    {
      commissionAmount: 99,
      commissionCurrency: CommissionCurrency.AUD,
      commissionType: CommissionType.fixed,
      commissionPaymentType: CommissionPaymentType.prepaid,
    },
  ],
  isAcceptingIntroductions: false,
  isActive: false,
  isComplete: false,
};
