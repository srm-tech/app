import { ObjectId } from '@/lib/db';

const MyContacts = (collection) => ({
  create: async (data) => {
    return collection.insertOne(data);
  },
  readMany: async ({ userId }) => {
    return collection
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'contactId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $addFields: {
            // invitedById: '$_id',
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
            isFavourite: '$isFavourite',
          },
        },
        { $unset: 'user' },
      ])
      .toArray();
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
