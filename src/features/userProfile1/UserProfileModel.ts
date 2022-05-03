import { connectToDatabase, ObjectId } from '@/lib/db';

import { Commission } from '../agreements/AgreementModel';

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
}

const initialValue: Omit<UserProfile, '_id' | 'userId'> = {
  firstName: '',
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
  defaultCommission: [],
  isAcceptingIntroductions: false,
  isActive: false,
  isComplete: false,
};

export const UserProfileModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<UserProfile>('UserProfile');
  return {
    create: async (data: UserProfile) => {
      return collection.insertOne({ ...initialValue, ...data });
    },
    updateOne: async (userId, data: UserProfile) => {
      const { _id, ...rest } = data;
      await collection.updateOne(
        { userId },
        { $set: { ...initialValue, ...rest } }
      );
      return await collection.findOne({ userId });
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
        .toArray();
    },
  };
};

export default UserProfileModel;
