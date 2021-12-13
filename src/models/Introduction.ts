import { ObjectId } from '@/lib/db';

const Introduction = (collection) => ({
  readMany: async (userId: ObjectId) => {
    return collection
      .aggregate([
        {
          $match: {
            action: 'sent',
            from: userId,
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'to',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
      ])
      .sort({ date: -1 })
      .toArray();
  },
  drafts: async (userId: ObjectId) => {
    return collection
      .aggregate([
        {
          $match: {
            action: 'draft',
            to: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $addFields: {
            userId: '$_id',
            name: {
              $concat: ['$user.firstName', ' ', '$user.lastName'],
            },
            email: '$user.email',
            phone: '$user.phone',
            businessName: '$user.businessName',
            businessCategory: '$user.businessCategory',
            rating: '$user.rating',
            succesfulRate: '$user.succesfulRate',
            averageCommission: '$user.averageCommission',
            commissionEarned: '$user.commissionEarned',
          },
        },
        { $unset: 'user' },
      ])
      .sort({ date: -1 })
      .toArray();
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
  getFinalise: async (fromId, objId, toId) => {
    return await collection
      .aggregate([
        {
          $match: {
            action: 'sent',
            from: fromId,
            to: toId,
            _id: objId,
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'to',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
      ])
      .toArray();
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

    const update = await collection.updateOne({});

    // return obj;
  },
});

export default Introduction;
