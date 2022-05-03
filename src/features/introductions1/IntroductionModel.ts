import { connectToDatabase, ObjectId } from '@/lib/db';

import { Agreement } from '../agreements/AgreementModel';
import { UserProfile } from '../userProfile/constants';

export enum IntroStatus {
  accepted = 'accepted',
  declined = 'declined',
  pending = 'pending',
}
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

export type CustomerProps =
  | 'userId'
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

export interface Introduction {
  _id: ObjectId;
  status: IntroStatus;
  updatedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  business: Business;
  customer: Customer;
  guru: Guru;
  agreement: Agreement;
}

export const IntroductionModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Introduction>('Introduction');
  return {
    create: async (data: Introduction) => {
      return collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
    updateOne: async (_id, data: Partial<Introduction>) => {
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return await collection.findOne({ _id: new ObjectId(_id) });
    },
    search: async ({ businessId, guruId }) => {
      return collection
        .find({
          'business.userId': businessId,
          'guru.userId': guruId,
        })
        .toArray();
    },
    findOne: async (_id) => {
      return collection.findOne({ _id: new ObjectId(_id) });
    },
  };
};

export default IntroductionModel;
