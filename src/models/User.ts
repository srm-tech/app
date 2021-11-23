import { getDb } from '@/lib/db';
const { client, collection } = getDb('users');

const User = {
  create: async (data) => {
    await client.connect();
    return collection?.insertOne(data);
  },
  readMany: async ({ userId }) => {
    await client.connect();
    return collection?.find({ userId }).toArray();
  },
  searchForGuru: async ({ query = '' }) => {
    await client.connect();
    return collection
      .aggregate([
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
            $and: [{ search: { $regex: query, $options: 'i' }, flag: 'guru' }],
          },
        }, //stage2
        { $limit: 30 },
        { $unset: 'userId' }, // remove filed from result
      ])
      .toArray();
  },
  getOne: async (userId) => {
    await client.connect();
    return collection.findOne({
      _id: userId,
    });
  },
  updateOne: async (data) => {
    await client.connect();
    return collection.updateOne({ _id: data.userId }, { $set: data });
  },
};

export default User;
