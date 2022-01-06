import { Collection, ObjectId } from 'mongodb';

export interface UserProfile {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  businessCategory: string;
  rating: number;
  successfulRate: number;
  averageCommission: number;
  commissionType: string;
  commissionValue: number;
  commissionCurrency: string;
  commissionPerReceivedLead: number;
  commissionPerCompletedLead: number;
  commissionPerReceivedLeadPercent: number;
  isActive: boolean;
  address1: string;
  address2: string;
  address3: string;
  country: string;
}

const UserProfile = (collection: Collection<UserProfile>) => ({
  create: async (_id, data) => {
    return collection?.insertOne({ ...data, _id: new ObjectId(_id) });
  },
  readMany: async ({ userId }) => {
    return collection?.find({ userId }).toArray();
  },
  searchForBusinessQuick: async (q: string) => {
    const query = new RegExp(q, 'i');
    return collection
      .aggregate([
        //pipeline array
        {
          $project: {
            firstName: 1,
            lastName: 1,
            businessName: 1,
            businessCategory: 1,
            isBusiness: 1,
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
          },
        }, //stage1
        {
          $match: {
            search: { $regex: query },
            isBusiness: true,
          },
        }, //stage2
      ])
      .limit(10)
      .toArray();
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
            as: 'reviews',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  business: 0,
                  guru: 0,
                  jobId: 0,
                  comment: 0,
                  date: 0,
                },
              },
            ],
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
            avgRate: {
              $avg: '$reviews.rate',
            },
          },
        },
        {
          $unset: [
            'rating',
            'successfulRate',
            'averageCommission',
            'isActive',
            'isGuru',
            'isBusiness',
          ],
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
      _id: new ObjectId(userId),
    });
  },
  getOneByEmail: async (email) => {
    return collection.findOne({
      email,
    });
  },
  updateOne: async (_id, data) => {
    return collection.updateOne(
      { _id },
      { $set: { ...data, _id: new ObjectId(_id) } },
      { upsert: true }
    );
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
    customerId: ObjectId,
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
      { _id: customerId },
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
