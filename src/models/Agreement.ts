import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';

const Agreement = (collection: Collection<Document>) => ({
  create: async (data) => {
    data.reviewedId = new ObjectId(data.reviewedId);
    return collection.insertOne(data);
  },
  createJob: async (data) => {
    return collection.insertOne(data);
  },
  findOne: async (userId: ObjectId) => {
    return collection.findOne({
      userId,
    });
  },
  updateOne: async (data) => {
    const uid = data.userId;
    delete data.userId;
    return collection.updateOne(
      { userId: uid },
      { $set: data },
      {
        upsert: true,
      }
    );
  },
});

export default Agreement;
