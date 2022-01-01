import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';

const Introduction = (collection: Collection<Document>) => ({
  readMany: async (userId: ObjectId) => {
    return collection
      .aggregate([
        {
          $match: {
            action: 'sent',
            business: userId,
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'customer',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $set: {
            'user.firstName': {
              $cond: [
                {
                  $in: ['$status', ['pending', 'declined']],
                },
                {
                  $concat: [
                    {
                      $substr: ['$user.firstName', 0, 1],
                    },
                    '*****',
                  ],
                },
                '$user.firstName',
              ],
            },
          },
        },
        {
          $set: {
            'user.lastName': {
              $cond: [
                {
                  $in: ['$status', ['pending', 'declined']],
                },
                {
                  $concat: [
                    {
                      $substr: ['$user.lastName', 0, 1],
                    },
                    '*****',
                  ],
                },
                '$user.lastName',
              ],
            },
          },
        },
        {
          $set: {
            'user.email': {
              $cond: [
                {
                  $in: ['$status', ['pending', 'declined']],
                },
                '',
                '$user.email',
              ],
            },
          },
        },
        {
          $addFields: {
            sumCommissionCustomer: { $sum: '$user.commissionCustomer' },
            sumCommissionBusiness: { $sum: '$user.commissionBusiness' },
          },
        },
      ])
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
  getFinalise: async (businessId, objId, status = null) => {
    let statuses;
    if (!status) {
      statuses = ['waiting for guru', 'accepted'];
    } else {
      statuses = [status];
    }
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'customer',
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
              $in: statuses,
            },
            business: businessId,
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
        business: userId,
      },
      {
        $set: {
          status: 'accepted',
        },
      }
    );
  },
  decline: async (userId, objId) => {
    return await collection.updateOne(
      {
        _id: objId,
        business: userId,
      },
      {
        $set: {
          status: 'declined',
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
  details: async (objId: ObjectId) => {
    const result = collection
      .aggregate([
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'customer',
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
          $lookup: {
            from: 'userProfiles',
            localField: 'business',
            foreignField: '_id',
            as: 'business',
          },
        },
        {
          $unwind: '$business',
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'introducedBy',
            foreignField: '_id',
            as: 'introduced',
          },
        },
        {
          $unwind: '$introduced',
        },
        {
          $match: {
            _id: objId,
          },
        },
      ])
      .toArray();
    return result;
  },
  waitingForGuru: async () => {
    const result = collection
      .aggregate([
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'customer',
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
          $lookup: {
            from: 'userProfiles',
            localField: 'business',
            foreignField: '_id',
            as: 'business',
          },
        },
        {
          $unwind: '$business',
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'introducedBy',
            foreignField: '_id',
            as: 'introduced',
          },
        },
        {
          $unwind: '$introduced',
        },
        {
          $match: {
            status: 'waiting for Guru',
          },
        },
      ])
      .toArray();
    return result;
  },
});

export default Introduction;
