import { ObjectId } from '@/lib/db';

const Connection = (collection) => ({
  readMany: async (userId: ObjectId) => {
    return collection.find({ _id: userId }).toArray();
  },
});

export default Connection;
