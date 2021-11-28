import { getCollection } from '@/lib/db';
const { client, collection } = getCollection('myContacts');

const MyContacts = {
  create: async (data) => {
    await client.connect();
    return collection.insertOne(data);
  },
  readMany: async ({ userId }) => {
    await client.connect();
    return collection.find({ userId }).toArray();
  },
  search: async ({ userId, query = '' }) => {
    await client.connect();
    return collection
      ?.aggregate([
        //pipeline array
        {
          $project: {
            search: {
              $concat: ['$firstName', ' ', '$lastName', ' - ', '$businessName'],
            },
            name: { $concat: ['$firstName', ' ', '$lastName'] },
            businessName: '$businessName',
            userId: '$userId',
            category: '$businessCategory',
          },
        }, //stage1
        {
          $match: {
            $and: [{ search: { $regex: query, $options: 'i' } }, { userId: 1 }],
          },
        }, //stage2
        { $limit: 30 },
        { $unset: 'userId' }, // remove filed from result
      ])
      .toArray();
  },
};

export default MyContacts;
