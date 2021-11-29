import { ObjectId } from '@/lib/db';

const Favourite = (collection) => ({
  readMany: async (userId: ObjectId) => {
    return collection.find({ _id: userId }).toArray();
  },
});

export default Favourite;
