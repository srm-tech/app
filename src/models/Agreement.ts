import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Agreement = (collection: Collection<Document>) => ({
  create: async (data) => {
    data.reviewedId = new ObjectId(data.reviewedId);
    return collection.insertOne(data);
  },
  createJob: async (data) => {
    return collection.insertOne(data);
  },
  findOne: async (userId) => {
    return collection.findOne({
      userId: new ObjectId(userId),
    });
  },
});

export default Agreement;
