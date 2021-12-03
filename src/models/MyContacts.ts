import { ObjectId } from '@/lib/db';

const MyContacts = (collection) => ({
  create: async (data) => {
    data.date = new Date();
    return collection.insertOne(data);
  },
  readMany: async ({ userId }) => {
    const contacts = await collection
      ?.aggregate([
        {
          $match: {
            userId: userId,
            status: { $ne: 'declined' }, // don't get declined
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
        {
          $match: {
            userId: userId,
            status: { $ne: 'declined' }, // don't get declined
            search: { $regex: query, $options: 'i' },
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
  },
});

export default MyContacts;
