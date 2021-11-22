import { getDb, ObjectId } from '@/lib/db';
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
  readOne: async (userId, objId) => {
    await client.connect();
    return await collection.findOne({
      _id: objId,
      to: userId,
    });
  },
  accept: async (userId, objId) => {
    await client.connect();
    return await collection.updateOne(
      {
        _id: objId,
        to: userId,
      },
      {
        $set: {
          status: 'accepted',
          date: new Date(),
        },
      }
    );
  },
  decline: async (userId, objId) => {
    await client.connect();
    return await collection.updateOne(
      {
        _id: objId,
        to: userId,
      },
      {
        $set: {
          status: 'declined',
          date: new Date(),
        },
      }
    );
  },
};

export default Introduction;
