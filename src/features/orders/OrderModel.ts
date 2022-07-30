import { connectToDatabase, ObjectId } from '@/lib/db';

import { OrderStatus } from './OrderConstants';

export type Order = {
  _id: ObjectId | string;
  amountOwned: number;
  introduceGuruFee: number;
  total: number;
  invoiceUrl: string;
  status: OrderStatus;
};

export const OrderModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Order>('Order');
  return {
    create: async (data) => {
      const count = await collection.countDocuments();
      const { insertedId } = await collection.insertOne({
        ...data,
        no: 1000 + count,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: OrderStatus.PENDING,
      });
      return await collection.findOne({ _id: insertedId });
    },
    updateOne: async (_id, data: Partial<Order>) => {
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return await collection.findOne({ _id: new ObjectId(_id) });
    },
    findOne: async (_id) => {
      return collection.findOne({ _id: new ObjectId(_id) });
    },
  };
};

export default OrderModel;
