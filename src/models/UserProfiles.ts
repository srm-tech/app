const UserProfile = (collection) => ({
  create: async (data) => {
    return collection?.insertOne(data);
  },
  readMany: async ({ userId }) => {
    return collection?.find({ userId }).toArray();
  },
  searchForBusiness: async (q: string) => {
    const query = new RegExp(q, 'i');
    return collection
      .aggregate([
        //pipeline array
        {
          $addFields: {
            search: {
              $concat: [
                '$firstName',
                ' ',
                '$lastName',
                ' - ',
                '$businessName',
                ' (',
                '$businessCategory',
                ')',
              ],
            },
            name: { $concat: ['$firstName', ' ', '$lastName'] },
          },
        }, //stage1
        {
          $match: {
            search: { $regex: query },
            isBusiness: true,
          },
        }, //stage2
      ])
      .toArray();
  },
  searchForGuru: async ({ query = '' }) => {
    return collection
      .aggregate([
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
                ' (',
                '$businessCategory',
                ')',
              ],
            },
            name: { $concat: ['$firstName', ' ', '$lastName'] },
            businessName: '$businessName',
            userId: '$userId',
            category: '$businessCategory',
            isBusiness: '$isBusiness',
            isGuru: '$isGuru',
          },
        },
        {
          $match: {
            search: { $regex: query, $options: 'i' },
            isGuru: true,
          },
        },
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

export default UserProfile;
