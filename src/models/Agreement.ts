import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('agreements');

const Agreement = {
  create: async (data) => {
    await client.connect();
    data.reviewedId = new ObjectId(data.reviewedId);
    return collection.insertOne(data);
  },
};

export default Agreement;
