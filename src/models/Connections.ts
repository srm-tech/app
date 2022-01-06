import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Connection = (collection: Collection<Document>) => ({
  readMany: async (_id: ObjectId) => {
    return collection.find({ _id }).toArray();
  },
});

export default Connection;
