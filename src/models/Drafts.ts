import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('drafts');

const Draft = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ _id: userId }).toArray();
  },
};

export default Draft;
