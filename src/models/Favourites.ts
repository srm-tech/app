import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Favourite = (collection: Collection<Document>) => ({
  readMany: async (userId: ObjectId) => {
    return collection.find({ _id: userId }).toArray();
  },
});

export default Favourite;
