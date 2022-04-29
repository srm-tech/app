import { connectToDatabase, ObjectId } from '@/lib/db';

interface Session {
  _id?: ObjectId;
  token: string;
  type: 'verification' | 'refreshToken';
  expiresAt?: Date;
}

export const SessionModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Session>('Session');
  return {
    create: async (data) => {
      return collection.insertOne(data);
    },
    remove: async (data) => {
      return collection.deleteOne(data);
    },
    get: async (data) => {
      return collection.findOne({ token: data.token, type: data.type });
    },
    verify: async (data) => {
      return collection.findOne({
        token: data.token,
        type: data.type,
        expiresAt: { $gt: new Date() },
      });
    },
  };
};
