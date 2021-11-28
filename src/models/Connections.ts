import { getCollection, ObjectId } from '@/lib/db';
const { client, collection } = getCollection('connections');

const Connection = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ _id: userId }).toArray();
  },
};

export default Connection;
