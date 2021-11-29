import { ObjectId } from '@/lib/db';

const Agreement = (collection) => ({
  create: async (data) => {
    data.reviewedId = new ObjectId(data.reviewedId);
    return collection.insertOne(data);
  },
});

export default Agreement;
