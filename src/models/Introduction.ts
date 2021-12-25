import { Collection, ObjectId } from 'mongodb';

function prepareFieldObfuscator(fields, obfuscate = true) {
  const query = [];

  fields.forEach(function (field: any) {
    if (obfuscate) {
      query.push({
        $replaceWith: {
          $setField: {
            field: field.newField,
            input: '$$ROOT',
            value: {
              $cond: [
                {
                  $in: ['$status', ['pending', 'declined']],
                },
                {
                  $concat: [
                    {
                      $substr: [field.field, 0, 1],
                    },
                    field.replacement,
                  ],
                },
                field.field,
              ],
            },
          },
        },
      });
    }

    query.push({
      $unset: field.field.slice(1),
    });
  });
  return query;
}

const Introduction = (collection: Collection<Document>) => ({
  readMany: async (userId: ObjectId) => {
    const query = prepareFieldObfuscator([
      {
        field: '$user.firstName',
        newField: 'firstName',
        replacement: '*****',
      },
      {
        field: '$user.lastName',
        newField: 'lastName',
        replacement: '*****',
      },
      {
        field: '$user.email',
        newField: 'email',
        replacement: '****@****.***',
      },
    ]);

    const unset = {
      $unset: [
        'guruId',
        'agreementId',
        'customerId',
        'user.isGuru',
        'user.isActive',
        'user.accountLink',
        'user.stripeId',
      ],
    };

    const addFields = {
      $addFields: {
        sumCommissionCustomer: { $sum: '$user.commissionCustomer' },
        sumCommissionBusiness: { $sum: '$user.commissionBusiness' },
      },
    };

    return collection
      .aggregate([
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'customerId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        ...query,
        addFields,
        {
          $addFields: {
            position: 'business',
          },
        },
        unset,
        {
          $match: {
            action: 'sent',
            business: userId,
          },
        },
        {
          $unionWith: {
            coll: 'introductions',
            pipeline: [
              {
                $match: {
                  action: 'sent',
                  customerId: userId,
                },
              },
              {
                $lookup: {
                  from: 'userProfiles',
                  localField: 'business',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $unwind: '$user',
              },
              {
                $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'jobId',
                  as: 'review',
                },
              },
              {
                $addFields: {
                  firstName: '$user.firstName',
                  lastName: '$user.lastName',
                  email: '$user.email',
                  position: 'guru',
                },
              },
              addFields,
              unset,
              {
                $set: {
                  status: {
                    $cond: [
                      { $eq: ['$status', 'pending'] },
                      'waiting for approval',
                      '$status',
                    ],
                  },
                },
              },
            ],
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
            successfulRate: '$user.successfulRate',
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
  update: async (_id, { _id: skipId, ...data }: any) => {
    if (data.customerId) {
      data.customerId = new ObjectId(data.customerId);
    }
    if (data.business) {
      data.business = new ObjectId(data.business);
    }
    if (data.guruId) {
      data.guruId = new ObjectId(data.guruId);
    }
    return collection.updateOne({ _id: new ObjectId(_id) }, { $set: data });
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
    return await collection.findOne({ _id: new ObjectId(id) });
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
            localField: 'customerId',
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
  // todo: is this method necessary?
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

    // const update = await collection.updateOne({});

    return obj;
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
            localField: 'customerId',
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
            localField: 'guruId',
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
            localField: 'customerId',
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
            localField: 'guruId',
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
