import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Connection = (collection: Collection<Document>) => ({
  readMany: async (userId: ObjectId) => {
    return collection.find({ _id: userId }).toArray();
  },
});

export default Connection;
