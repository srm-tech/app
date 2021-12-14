import { ObjectId } from '@/lib/db';

const Agreement = (collection) => ({
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
