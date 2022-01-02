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
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'business',
            as: 'review',
          },
        },
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

            avgCommissionCustomer: {
              $avg: '$commissionCustomer',
            },
            avgCommissionBusiness: {
              $avg: '$commissionBusiness',
            },
            avgRating: {
              $avg: '$business.rate',
            },
          },
        },
        {
          $match: {
            search: { $regex: query },
          },
        },
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
  addCommission: async (
    business: ObjectId,
    customer: ObjectId,
    amount: number
  ) => {
    const resultBusiness = await collection.updateOne(
      { _id: business },
      {
        $push: {
          commissionBusiness: amount,
        },
      }
    );
    const resultCustomer = await collection.updateOne(
      { _id: customer },
      {
        $push: {
          commissionCustomer: amount,
        },
      }
    );
    return {
      resultBusiness: resultBusiness,
      resultCustomer: resultCustomer,
    };
  },
  stripeCheck: async (userId: ObjectId) => {
    await collection.find({
      _id: userId,
      stripeId: { $exists: true },
    });
  },
  /*
  addReview: async (data) => {
    data.date = new Date();
    const businessId = new ObjectId(data.business);
    const jobId = new ObjectId(data.jobId);
    const business = await collection.findOne({
      _id: businessId
    });
    const result = await collection.updateOne(
      {
        _id: businessId
      },
      {
        $push: {
          reviews: {
            guru: data.guru,
            date: new Date(),
            rate: data.rate,
            comment: data.comment,
            job: jobId
          }
        }
      }
      )
      return business;
  }*/
});

export default UserProfile;
