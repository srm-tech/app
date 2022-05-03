import { connectToDatabase, ObjectId } from '@/lib/db';

export enum CommissionCurrency {
  AUD = 'AUD',
  USD = 'USD',
}
export enum CommissionType {
  fixed = 'fixed',
  percent = 'percent',
}

export enum CommissionPaymentType {
  prepaid = 'prepaid',
  postpaid = 'postpaid',
}

export interface Agreement {
  _id: ObjectId;
  businessId: string;
  guruId: string;
  commissionCurrency: CommissionCurrency;
  commissionType: CommissionType;
  commissionPaymentType: CommissionPaymentType;
  commissionValue: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Commission = Omit<Agreement, '_id' | 'agreedAt'>;

export const AgreementModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Agreement>('Agreement');
  return {
    create: async (data: Agreement) => {
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
          businessId,
          guruId,
        })
        .toArray();
    },
    findOne: async (_id) => {
      return collection.findOne({ _id: new ObjectId(_id) });
    },
  };
};

export default AgreementModel;
