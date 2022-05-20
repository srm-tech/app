import { connectToDatabase, ObjectId } from '@/lib/db';

export interface Rating {
  _id: ObjectId;
  userId: string;
  from: string;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
export type NewRating = Omit<Rating, '_id' | 'createdAt' | 'updatedAt'>;
export interface AvgRating {
  _id: string;
  avgRating: number;
}

export const RatingModel = async () => {
  const { db } = await connectToDatabase();
  const collection = db.collection<Rating>('Rating');
  return {
    create: async (data) => {
      return collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
    updateOne: async (_id, data: Rating) => {
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
      return await collection.findOne({ _id: new ObjectId(_id) });
    },
    search: async ({ userId }) => {
      return collection
        .find({
          userId,
        })
        .toArray();
    },
    searchStats: async ({ userId }) => {
      if (!userId) return [];
      return collection
        .aggregate([
          {
            $match: {
              userId: userId,
            },
          },
          {
            $group: {
              _id: '$userId',
              avgRating: { $avg: '$rating' },
            },
          },
        ])
        .toArray();
    },
    findOne: async (_id) => {
      return collection.findOne({ _id: new ObjectId(_id) });
    },
  };
};

export default RatingModel;
