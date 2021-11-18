import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('drafts');

const Draft = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ _id: userId }).toArray();
  },
  create: async (data) => {
    await client.connect();
    return collection.insertOne(data);
  },
};

export default Draft;
