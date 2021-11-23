import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('myContacts');

const Review = {
  create: async (data) => {
    await client.connect();
    return collection.insertOne(data);
  },
};

export default Review;
