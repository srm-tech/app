import { Collection, ObjectId } from 'mongodb';

export interface UserProfile {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  businessCategory: string;
  rating: number;
  succesfulRate: number;
  averageCommission: number;
  isActive: boolean;
  address1: string;
  address2: string;
  address3: string;
  country: string;
}

const UserProfile = (collection: Collection<Document>) => ({
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
  searchForCustomer: async (contact: string, type: 'email' | 'phone') => {
    const connections = await collection
      .aggregate([
        {
          $lookup: {
            from: 'connections',
            localField: '_id',
            foreignField: 'user2',
            as: 'myConnection',
          },
        },

        {
          $match: { phone: '786865787' },
        },
        {
          $unwind: '$myConnection',
        },
        {
          $project: {
            'myConnection.user2._id': 1,
          },
        },
        {
          $unset: 'myConnection',
        },
        { $limit: 1 },
      ])
      .toArray();
    return connections[0];
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
  getOneByEmail: async (email) => {
    return collection.findOne({
      email,
    });
  },
  updateOne: async (data) => {
    const _id = data.userId;
    delete data.userId;
    delete data._id;
    return collection.updateOne({ _id: _id }, { $set: data });
  },
  addStripe: async (data) => {
    return collection.updateOne(
      { _id: data._id },
      {
        $set: {
          stripeId: data.stripeId,
          accountLink: data.accountLink,
        },
      }
    );
  },
});

export default UserProfile;
