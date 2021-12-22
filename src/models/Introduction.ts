import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Introduction = (collection: Collection<Document>) => ({
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
  getOne: async (id) => {
    return await collection.findOne({ _id: id });
  },
  getFinalise: async (fromId, objId) => {
    const result = await collection
      .aggregate([
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
        {
          $lookup: {
            from: 'agreements',
            localField: 'agreementId',
            foreignField: '_id',
            as: 'agreement',
          },
        },
        {
          $unwind: '$agreement',
        },
        {
          $match: {
            action: 'sent',
            status: {
              $in: ['accepted', 'waiting for Guru'],
            },
            from: fromId,
            _id: objId,
          },
        },
      ])
      .toArray();
    if (result) {
      return result[0];
    } else {
      return [];
    }
  },
  accept: async (userId, objId) => {
    return await collection.updateOne(
      {
        _id: objId,
        from: userId,
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
        from: userId,
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
  updateStatus: async (jobId, status) => {
    const obj = await collection.updateOne(
      {
        _id: jobId,
      },
      {
        $set: {
          status: status,
        },
      }
    );
    return obj;
  },
});

export default Introduction;
