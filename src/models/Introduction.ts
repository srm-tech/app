import { getCollection, ObjectId } from '@/lib/db';
const { client, collection } = getCollection('introductions');

const Introduction = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ userId }).toArray();
  },
  create: async (data) => {
    await client.connect();
    return collection.insertOne(data);
  },
  now: async (data) => {
    await client.connect();
    data.contactId = new ObjectId(data.contactId);
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
  reviewDefaultAgreement: async (data) => {
    await client.connect();
    console.log(data);
    const obj = await collection.updateOne(
      {
        _id: new ObjectId(data.introId),
        userId: data.userId,
      },
      {
        $set: {
          agreement: data,
        },
      }
    );
    return obj;
  },
  timeToFinish: async (data) => {
    await client.connect();
    const obj = await collection.updateOne(
      {
        _id: new ObjectId(data.introId),
        userId: data.userId,
      },
      {
        $set: {
          aboutTheJob: data.aboutTheJob,
          agreement: { timeToFinish: data.timeToFinish },
        },
      }
    );
    return obj;
  },
  finalise: async (data) => {
    await client.connect();
    const obj = await collection.updateOne(
      {
        _id: new ObjectId(data.introId),
        userId: data.userId,
      },
      {
        $set: {
          data,
        },
      }
    );
    return obj;
  },
};

export default Introduction;
