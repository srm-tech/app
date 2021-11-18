import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('myContacts');

const Introduction = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ userId }).toArray();
  },
};

export default Introduction;
