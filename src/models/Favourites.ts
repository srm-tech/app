import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';

const Favourite = (collection: Collection<Document>) => ({
  readMany: async (userId: ObjectId) => {
    return collection.find({ _id: userId }).toArray();
  },
});

export default Favourite;
