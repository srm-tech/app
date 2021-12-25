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
  searchForBusiness: async ({ query = '', x, y }) => {
    await client.connect();
    // todo do not hardcode this
    const maxDist = 25000;
    const minDist = 25000;
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
            $and: [{ search: { $regex: query, $options: 'i' } }],
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [x, y],
              },
              $maxDistance: maxDist,
              $minDistance: minDist,
            },
          },
        }, //stage2
        { $limit: 30 },
        { $unset: 'userId' }, // remove filed from result
      ])
      .toArray();
  },
};

export default User;
