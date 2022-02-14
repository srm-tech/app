import { Collection, ObjectId } from "mongodb";

function prepareFieldObfuscator(fields, obfuscate = true) {
  const query: Array<any> = [];

  fields.forEach(function (item: any) {
    const replace = {
      $replaceWith: {
        $setField: {
          field: item.newField,
          input: "$$ROOT",
          value: {
            $cond: [
              {
                $in: ["$status", ["pending", "declined"]],
              },
              {
                $concat: [
                  {
                    $substr: [item.field, 0, 1],
                  },
                  item.replacement,
                ],
              },
              item.field,
            ],
          },
        },
      },
    };
    query.push(replace);

    // query.push({
    //   $unset: item.newField.slice(1),
    // });
  });
  return query;
}

const Introduction = (collection: Collection<Document>) => ({
  readMany: async (userId: ObjectId) => {
    const obfuscatedFields = prepareFieldObfuscator([
      {
        field: "$customer.firstName",
        newField: "obfsFirstName",
        replacement: "*****",
      },
      {
        field: "$customer.lastName",
        newField: "obfsLastName",
        replacement: "*****",
      },
      {
        field: "$customer.name",
        newField: "obfsName",
        replacement: "*****",
      },
      {
        field: "$customer.email",
        newField: "obfsContactEmail",
        replacement: "****@****.***",
      },
      {
        field: "$customer.phone",
        newField: "obfsContactPhone",
        replacement: "*****",
      },
      {
        field: "$customer.businessName",
        newField: "obfsBusinessName",
        replacement: "*****",
      },
    ]);

    const unset = {
      $unset: [
        "user.isGuru",
        "user.isActive",
        "user.accountLink",
        "user.stripeId",
        "obfsName",
        "obfsFirstName",
        "obfsLastName",
        "obfsContactPhone",
        "obfsContactEmail",
        "obfsBusinessName",
      ],
    };

    // as business union with as guru
    const result = await collection
      .aggregate([
        // as business
        ...obfuscatedFields,
        {
          $addFields: {
            position: "business",
            "customer.firstName": "$obfsFirstName",
            "customer.lastName": "$obfsLastName",
            "customer.name": "$obfsName",
            "customer.email": "$obfsContactEmail",
            "customer.phone": "$obfsContactPhone",
            sumCommission: { $sum: "$commissionBusiness" },
          },
        },
        unset,
        {
          $match: {
            action: "sent",
            "business._id": userId,
          },
        },
        // as guru
        {
          $unionWith: {
            coll: "introductions",
            pipeline: [
              {
                $addFields: {
                  position: "guru",

                  sumCommission: { $sum: "$commissionCustomer" },
                },
              },
              unset,
              {
                $lookup: {
                  from: "reviews",
                  localField: "_id",
                  foreignField: "jobId",
                  as: "review",
                },
              },
              {
                $set: {
                  status: {
                    $cond: [
                      { $eq: ["$status", "pending"] },
                      "waiting for approval",
                      { $concat: ["$status"] },
                    ],
                  },
                },
              },
              {
                $match: {
                  action: "sent",
                  "guru._id": userId,
                },
              },
            ],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
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
            action: "draft",
            to: userId,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "from",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $addFields: {
            userId: "$_id",
            name: {
              $concat: ["$user.firstName", " ", "$user.lastName"],
            },
            email: "$user.email",
            phone: "$user.phone",
            businessName: "$user.businessName",
            businessCategory: "$user.businessCategory",
            rating: "$user.rating",
            successfulRate: "$user.successfulRate",
            averageCommission: "$user.averageCommission",
            commissionEarned: "$user.commissionEarned",
          },
        },
        { $unset: "user" },
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
      statuses = ["waiting for guru", "accepted"];
    } else {
      statuses = [status];
    }
    const result = await collection
      .aggregate([
        {
          $addFields: {
            user: "$guru",
          },
        },
        {
          $match: {
            action: "sent",
            status: {
              $in: statuses,
            },
            _id: objId,
          },
        },
        {
          $lookup: {
            from: "userProfiles",
            localField: "guru._id",
            foreignField: "_id",
            as: "fresh",
          },
        },
        {
          $unwind: "$fresh",
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
        // business: userId,
      },
      {
        $set: {
          status: "accepted",
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
          status: "declined",
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
            from: "userProfiles",
            localField: "customerId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "agreements",
            localField: "agreementId",
            foreignField: "_id",
            as: "agreement",
          },
        },
        {
          $unwind: "$agreement",
        },
        {
          $lookup: {
            from: "userProfiles",
            localField: "business",
            foreignField: "_id",
            as: "business",
          },
        },
        {
          $unwind: "$business",
        },
        {
          $lookup: {
            from: "userProfiles",
            localField: "guruId",
            foreignField: "_id",
            as: "introduced",
          },
        },
        {
          $unwind: "$introduced",
        },
        {
          $addFields: {
            remindersCount: {
              $size: "$reminders",
            },
          },
        },
        {
          $match: {
            status: "waiting for Guru",
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
