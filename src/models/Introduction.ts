import { getDb } from '@/lib/db';
const { client, collection } = getDb('myContacts');

const Introduction = {
  readMany: async ({ userId }) => {
    await client.connect();
    return collection.find({ userId }).toArray();
  },
};

export default Introduction;
