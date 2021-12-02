import { ObjectId } from '@/lib/db';

const MyContacts = (collection) => ({
  create: async (data) => {
    data.date = new Date();
    return collection.insertOne(data);
  },
  readMany: async ({ userId }) => {
    const contacts = await collection
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'contactId',
            foreignField: '_id',
            as: 'contact',
          },
        },
        {
          $unwind: '$contact',
        },
        {
          $unionWith: {
            coll: 'myContacts',
            pipeline: [
              {
                $match: {
                  contactId: userId,
                },
              },
              {
                $lookup: {
                  from: 'userProfiles',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'contact',
                },
              },
              {
                $unwind: '$contact',
              },
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
    return contacts;
  },

  search: async ({ userId, query = '' }) => {
    return collection
      ?.aggregate([
        //pipeline array
        {
          $project: {
            search: {
              $concat: [
                '$firstName',
                ' ',
                '$lastName',
                ' - ',
                '$businessName',
                ' - ',
                '$businessCategory',
              ],
            },
            name: { $concat: ['$firstName', ' ', '$lastName'] },
            businessName: '$businessName',
            userId: '$userId',
            category: '$businessCategory',
          },
        }, //stage1
        {
          $match: {
            $and: [
              { search: { $regex: query, $options: 'i' } },
              { userId: new ObjectId(userId) },
            ],
          },
        }, //stage2
        { $limit: 30 },
        { $unset: 'userId' }, // remove filed from result
      ])
      .toArray();
  },
});

export default MyContacts;
