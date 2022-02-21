import { ObjectId } from 'bson';

export interface UserProfile {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  name: string;
  abn: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  businessCategory: string;
  rating: number;
  successfulRate: number;
  averageCommission: number;
  commissionType: string;
  commissionValue: number;
  commissionCurrency: string;
  commissionPerReceivedLead: number;
  commissionPerCompletedLead: number;
  commissionPerCompletedLeadPercent: number;
  isAcceptingIntroductions: boolean;
  address1: string;
  address2: string;
  address3: string;
  country: string;
  stripeId: string;
  accountLink: string;
  isActive: boolean;
  isComplete: boolean;
}

export type DefaultProfile = Omit<UserProfile, '_id'>;

export const defaultProfile: DefaultProfile = {
  firstName: '',
  lastName: '',
  name: '',
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
