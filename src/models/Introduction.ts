import { getDb, ObjectId } from '@/lib/db';
import { check, validate } from '@/lib/validator';
const { client, collection } = getDb('introductions');

const Introduction = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ userId }).toArray();
  },
  create: async (data) => {
    await client.connect();
    return collection.insertOne(data);
  },
  selectContacts: async (introductionId: ObjectId, userId: ObjectId, data) => {
    await client.connect();
    await validate([check('introductionId').isMongoId()]);
    const intro = await collection.findOne({
      _id: introductionId,
      userId: userId,
    });
    if (!intro) {
      return null;
    }
    return await collection.updateOne(
      { _id: introductionId },
      {
        $set: {
          sendTo: data,
        },
      }
    );
  },
  send: async (introductionId: ObjectId, userId: ObjectId) => {
    await client.connect();
    const intro = await collection.findOne({
      _id: introductionId,
      userId: userId,
    });
    if (!intro) {
      return null;
    }
    return await collection.updateOne(
      { _id: introductionId },
      {
        $set: {
          status: 'sent',
          date: new Date(),
        },
      }
    );
  },
};

export default Introduction;
