import { ObjectId } from '@/lib/db';

const Introduction = (collection) => ({
  readMany: async (userId: ObjectId) => {
    return collection.find({ userId }).toArray();
  },
  create: async (data) => {
    return collection.insertOne(data);
  },
  now: async (data) => {
    data.contactId = new ObjectId(data.contactId);
    return collection.insertOne(data);
  },
  readOne: async (userId, objId) => {
    return await collection.findOne({
      _id: objId,
      to: userId,
    });
  },
  accept: async (userId, objId) => {
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
});

export default Introduction;
