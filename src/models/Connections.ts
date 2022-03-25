import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';

const Connection = (collection: Collection<Document>) => ({
  readMany: async (_id: ObjectId) => {
    return collection.find({ _id }).toArray();
  },
});

export default Connection;
