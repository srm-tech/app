import { connectToDatabase, ObjectId } from '@/lib/db';

import {
  CommissionCurrency,
  CommissionPaymentType,
  CommissionType,
} from './agreementConstants';

export interface Agreement {
  _id: ObjectId;
  businessId: string;
  guruId: string;
  commissionCurrency: CommissionCurrency;
  commissionType: CommissionType;
  commissionPaymentType: CommissionPaymentType;
  commissionAmount: number;
  dealValue?: number;
  createdAt: Date;
  updatedAt: Date;
}
export type NewAgreement = Omit<Agreement, '_id'>;

export interface AgreementInput {
  businessId: string;
  guruId: string;
}

export type Commission = Omit<
  Agreement,
  '_id' | 'createdAt' | 'updatedAt' | 'guruId' | 'businessId'
>;

export const AgreementModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Agreement>('Agreement');
  return {
    create: async (data) => {
      return collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
    updateOne: async (_id, data: Agreement) => {
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return await collection.findOne({ _id: new ObjectId(_id) });
    },
    search: async ({ businessId, guruId }) => {
      return collection
        .find({
          businessId: businessId,
          guruId: guruId,
        })
        .toArray();
    },
    findOne: async (_id) => {
      return collection.findOne({ _id: new ObjectId(_id) });
    },
  };
};

export default AgreementModel;
