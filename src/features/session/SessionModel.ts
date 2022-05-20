import { connectToDatabase, ObjectId } from '@/lib/db';

export interface Session {
  _id?: ObjectId;
  token: string;
  type: 'verification' | 'refreshToken';
  expiresAt?: Date;
  verifiedAt?: Date;
}
export interface UserSession {
  _id: string;
  email: string;
  expiresAt: number; // seconds
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
    updateVerifyAt: async (data) => {
      return collection.updateOne(
        { token: data.token, type: data.type },
        { $set: { verifiedAt: new Date() } }
      );
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
