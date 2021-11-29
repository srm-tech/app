const User = (collection) => ({
  create: async (data) => {
    return collection?.insertOne(data);
  },
  readMany: async ({ userId }) => {
    return collection?.find({ userId }).toArray();
  },
  searchForGuru: async ({ query = '' }) => {
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
    return collection.findOne({
      _id: userId,
    });
  },
  updateOne: async (data) => {
    return collection.updateOne({ _id: data.userId }, { $set: data });
  },
});

export default User;
