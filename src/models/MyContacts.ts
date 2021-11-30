const MyContacts = (collection) => ({
  create: async (data) => {
    return collection.insertOne(data);
  },
  readMany: async ({ userId }) => {
    return collection.find({ userId }).toArray();
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
            $and: [{ search: { $regex: query, $options: 'i' } }, { userId: 1 }],
          },
        }, //stage2
        { $limit: 30 },
        { $unset: 'userId' }, // remove filed from result
      ])
      .toArray();
  },
});

export default MyContacts;
