import { connectToDatabase, ObjectId } from '@/lib/db';

import { IntroductionStatus } from './introductionConstants';
import { Agreement } from '../agreements/AgreementModel';
import {
  Business,
  Customer,
  CustomerInput,
  Guru,
  UserProfile,
} from '../userProfile1/UserProfileModel';

export interface Introduction {
  _id: ObjectId | string;
  status: IntroductionStatus;
  paid: number;
  business: Business;
  customer: Customer;
  guru: Guru;
  agreement: Agreement;
  updatedAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

export type NewIntroduction = Omit<Introduction, '_id'>;
export type UpdateStatusIntroduction = Pick<Introduction, '_id' | 'status'>;
export type UpdateAgreementForIntroduction = Pick<Introduction, '_id'> & {
  dealValue: number | string;
};

export type Quote = {
  amountOwned: number;
  introduceGuruFee: number;
  total: number;
};

export interface IntroductionInput {
  guruId: string;
  businessId: string;
  agreementId: string;
  customer: CustomerInput;
}

export const IntroductionModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Introduction>('Introduction');
  return {
    create: async (data) => {
      const { insertedId } = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await collection.findOne({ _id: insertedId });
    },
    updateOne: async (_id, data: Partial<Introduction>) => {
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return await collection.findOne({ _id: new ObjectId(_id) });
    },
    search: async ({ businessId, guruId }): Promise<Introduction[]> => {
      const [guru, business] = await Promise.all([
        collection
          .find({
            'guru.userId': guruId,
          })
          .toArray(),
        collection
          .find({
            'business.userId': businessId,
          })
          .toArray(),
      ]);
      return [...guru, ...business];
    },
    findOne: async (_id) => {
      return collection.findOne({ _id: new ObjectId(_id) });
    },
  };
};

export default IntroductionModel;
