import { connectToDatabase, ObjectId } from '@/lib/db';

import { Commission } from '@/features/agreements/AgreementModel';

import { defaultProfile } from './userProfileConstants';
import { Rating } from '../ratings/RatingModel';

export interface UserProfile {
  _id: ObjectId;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  abn: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  businessCategory: string;
  rating: number;
  successfulRate: number;
  averageCommission: number;
  defaultCommission: Commission[];
  isAcceptingIntroductions: boolean;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  stripeId: string;
  isActive: boolean;
  isComplete: boolean;
  beneficiary?: {
    firstName: string;
    lastName: string;
    contactEmail: string;
    bsb: string;
    accountNo: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
export type NewUserProfile = Omit<UserProfile, '_id'>;

export type BusinessProps =
  | 'userId'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'contactEmail'
  | 'contactPhone'
  | 'businessName'
  | 'businessCategory'
  | 'rating';
export type Business = Pick<UserProfile, BusinessProps>;
export type BusinessSearch = Pick<
  UserProfile,
  | 'businessCategory'
  | 'businessName'
  | 'firstName'
  | 'fullName'
  | 'userId'
  | 'rating'
>;

export type CustomerInput = {
  contact: string;
  name: string;
  contactType: string;
};
export type CustomerProps =
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'contactEmail'
  | 'contactPhone';
export type Customer = Pick<UserProfile, CustomerProps>;

export type GuruProps =
  | 'userId'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'contactEmail'
  | 'contactPhone'
  | 'rating';
export type Guru = Pick<UserProfile, GuruProps>;

export const UserProfileModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<UserProfile>('UserProfile');
  return {
    create: async (userId, data: UserProfile) => {
      await collection.insertOne({
        ...defaultProfile,
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        isActive: true,
        isComplete: true,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return collection.findOne({ userId });
    },
    updateOne: async (userId: string, data: Partial<UserProfile>) => {
      const { _id, ...rest } = data;
      const currentProfile = await collection.findOne({ userId });
      const newProfile = {
        ...defaultProfile,
        ...currentProfile,
        ...rest,
        fullName: `${data.firstName} ${data.lastName}`,
        userId,
        updatedAt: new Date(),
      };
      await collection.updateOne({ userId }, { $set: newProfile });
      return newProfile;
    },
    findOne: async (userId) => {
      return collection.findOne({ userId });
    },
    search: async (q: string) => {
      const query = new RegExp(q, 'i');
      return collection
        .aggregate([
          {
            $lookup: {
              from: 'reviews',
              localField: '_id',
              foreignField: 'business',
              as: 'reviews',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    business: 0,
                    guru: 0,
                    jobId: 0,
                    comment: 0,
                    date: 0,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              search: {
                $concat: [
                  '$firstName',
                  ' ',
                  '$lastName',
                  ' - ',
                  '$businessName',
                  ' (',
                  '$businessCategory',
                  ')',
                ],
              },
              name: { $concat: ['$firstName', ' ', '$lastName'] },
              avgCommissionCustomer: {
                $avg: '$commissionCustomer',
              },
              avgCommissionBusiness: {
                $avg: '$commissionBusiness',
              },
              rating: {
                $avg: '$reviews.rating',
              },
            },
          },
          {
            $unset: [
              'rating',
              'successfulRate',
              'averageCommission',
              'isActive',
              'isGuru',
              'isBusiness',
            ],
          },
          {
            $match: {
              search: { $regex: query },
              isAcceptingIntroductions: true,
            },
          },
        ])
        .toArray() as Promise<UserProfile[]>;
    },
    delete: async (userId) => {
      return collection.deleteOne({ userId });
    },
  };
};

export default UserProfileModel;
