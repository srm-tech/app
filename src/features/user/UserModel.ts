import { Collection, ObjectId } from 'mongodb';

import { connectToDatabase } from '@/lib/db';

interface User {
  _id?: ObjectId;
  email: string;
}

const initialValues = {};

export const UserModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<User>('User');
  return {
    get: async (data: User) => {
      return collection.findOne({ email: data.email });
    },
    upsert: async (data: User) => {
      return collection.findOneAndUpdate(
        { email: data.email },
        {
          $set: {
            ...initialValues,
            ...data,
          },
        },
        { upsert: true }
      );
    },
  };
};

export default UserModel;
