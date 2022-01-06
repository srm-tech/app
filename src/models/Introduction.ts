import { Collection, ObjectId } from 'mongodb';

function prepareFieldObfuscator(fields, obfuscate = true) {
  const query: Array<any> = [];

  fields.forEach(function (field: any) {
    const replace = {
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
    };
    query.push(replace);

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
        field: '$guru.firstName',
        newField: 'firstName',
        replacement: '*****',
      },
      {
        field: '$guru.lastName',
        newField: 'lastName',
        replacement: '*****',
      },
      {
        field: '$guru.contactEmail',
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
        sumCommissionCustomer: { $sum: '$fresh.commissionCustomer' },
        sumCommissionBusiness: { $sum: '$fresh.commissionBusiness' },
      },
    };

    // console.log("query:", query);

    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'guru._id',
            foreignField: '_id',
            as: 'fresh',
          },
        },
        {
          $unwind: '$fresh',
        },
        ...query,
        addFields,
        unset,
        {
          $addFields: {
            user: '$business',
            position: 'business',
          },
        },
        {
          $match: {
            action: 'sent',
            'business._id': userId,
          },
        },
        {
          $unionWith: {
            coll: 'introductions',
            pipeline: [
              {
                $lookup: {
                  from: 'userProfiles',
                  localField: 'guru._id',
                  foreignField: '_id',
                  as: 'fresh',
                },
              },
              {
                $unwind: '$fresh',
              },
              ...query,
              addFields,
              unset,
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
                  user: '$business',
                  firstName: '$business.firstName',
                  lastName: '$business.lastName',
                  email: '$business.email',
                  position: 'guru',
                },
              },
              {
                $set: {
                  status: {
                    $cond: [
                      { $eq: ['$status', 'pending'] },
                      'waiting for approval',
                      { $concat: ['guru ', '$status'] },
                    ],
                  },
                },
              },
              {
                $match: {
                  action: 'sent',
                  'guru._id': userId,
                },
              },
            ],
          },
        },
        // {
        //   $lookup: {
        //     from: 'userProfiles',
        //     localField: 'guru._id',
        //     foreignField: '_id',
        //     as: 'user',
        //   },
        // },
        // {
        //   $unwind: '$user',
        // },
        // {
        //   $lookup: {
        //     from: 'agreements',
        //     localField: 'agreement._id',
        //     foreignField: '_id',
        //     as: 'agreement',
        //   },
        // },
        // {
        //   $unwind: '$agreement',
        // },
        // ...query,
        // addFields,
        // {
        //   $addFields: {
        //     position: 'business',
        //   },
        // },
        // unset,
        // {
        //   $match: {
        //     action: 'sent',
        //     'business._id': userId,
        //   },
        // },
        // {
        //   $unionWith: {
        //     coll: 'introductions',
        //     pipeline: [
        //       {
        //         $match: {
        //           action: 'sent',
        //           'guru._id': userId,
        //         },
        //       },
        //       {
        //         $lookup: {
        //           from: 'userProfiles',
        //           localField: 'business._id',
        //           foreignField: '_id',
        //           as: 'user',
        //         },
        //       },
        //       {
        //         $unwind: '$user',
        //       },
        //       {
        //         $lookup: {
        //           from: 'reviews',
        //           localField: '_id',
        //           foreignField: 'jobId',
        //           as: 'review',
        //         },
        //       },
        //       {
        //         $addFields: {
        //           firstName: '$user.firstName',
        //           lastName: '$user.lastName',
        //           email: '$user.email',
        //           position: 'guru',
        //         },
        //       },
        //       addFields,
        //       unset,
        //       {
        //         $set: {
        //           status: {
        //             $cond: [
        //               { $eq: ['$status', 'pending'] },
        //               'waiting for approval',
        //               { $concat: ['$status', ' by other party'] },
        //             ],
        //           },
        //         },
        //       },
        //     ],
        //   },
        // },
      ])
      .toArray();
    // console.log(result);
    return result;
  },

  drafts: async (userId: ObjectId) => {
    return collection
      .aggregate([
        {
          $match: {
            action: 'draft',
            to: userId,
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
  getFinalise: async (objId, status = null) => {
    let statuses;
    if (!status) {
      statuses = ['waiting for guru', 'accepted'];
    } else {
      statuses = [status];
    }
    const result = await collection
      .aggregate([
        {
          $addFields: {
            user: '$guru',
          },
        },
        {
          $match: {
            action: 'sent',
            status: {
              $in: statuses,
            },
            _id: objId,
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'guru._id',
            foreignField: '_id',
            as: 'fresh',
          },
        },
        {
          $unwind: '$fresh',
        },
        // {
        //   $unwind: '$user',
        // },
        // {
        //   $lookup: {
        //     from: 'agreements',
        //     localField: 'agreementId',
        //     foreignField: '_id',
        //     as: 'agreement',
        //   },
        // },
        // {
        //   $unwind: '$agreement',
        // },
        // {
        //   $match: {
        //     action: 'sent',
        //     status: {
        //       $in: statuses,
        //     },
        //     _id: objId,
        //   },
        // },
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
        // business: userId,
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
        // business: userId,
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
  updateStatus: async (jobId: ObjectId, status: string) => {
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
      .find({
        _id: objId,
      })
      // .aggregate([
      //   {
      //     $lookup: {
      //       from: 'userProfiles',
      //       localField: 'guruId',
      //       foreignField: '_id',
      //       as: 'user',
      //     },
      //   },
      //   {
      //     $unwind: '$user',
      //   },
      //   {
      //     $lookup: {
      //       from: 'agreements',
      //       localField: 'agreementId',
      //       foreignField: '_id',
      //       as: 'agreement',
      //     },
      //   },
      //   {
      //     $unwind: '$agreement',
      //   },
      //   {
      //     $lookup: {
      //       from: 'userProfiles',
      //       localField: 'businessId',
      //       foreignField: '_id',
      //       as: 'business',
      //     },
      //   },
      //   {
      //     $unwind: '$business',
      //   },
      //   {
      //     $lookup: {
      //       from: 'userProfiles',
      //       localField: 'guruId',
      //       foreignField: '_id',
      //       as: 'guru',
      //     },
      //   },
      //   {
      //     $unwind: '$guru',
      //   },
      //   {
      //     $match: {
      //       _id: objId,
      //     },
      //   },
      // ])
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
          $addFields: {
            remindersCount: {
              $size: '$reminders',
            },
          },
        },
        {
          $match: {
            status: 'waiting for Guru',
            remindersCount: { $lt: 3 },
          },
        },
      ])
      .toArray();
    return result;
  },
  saveReminderDate: async (objId: ObjectId) => {
    const result = collection.updateOne(
      { _id: objId },
      {
        $push: {
          reminders: new Date(),
        },
      }
    );
    return result;
  },
});

export default Introduction;
