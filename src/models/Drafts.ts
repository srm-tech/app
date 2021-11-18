import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('drafts');

const Draft = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ _id: userId });
  },
};

export default Draft;
