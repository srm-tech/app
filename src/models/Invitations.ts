import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('invitations');

const Invitation = {
  getReceived: async (userId: ObjectId) => {
    await client.connect();
    return collection
      .aggregate([
        {
          $match: {
            to: userId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: '_id',
            as: 'invitedBy',
          },
        },
        { $unwind: '$invitedBy' },
        {
          $addFields: {
            invitedById: '$_id',
            name: {
              $concat: ['$invitedBy.firstName', ' ', '$invitedBy.lastName'],
            },
            email: '$invitedBy.email',
            phone: '$invitedBy.phone',
            businessName: '$invitedBy.businessName',
            businessCategory: '$invitedBy.businessCategory',
            rating: '$invitedBy.rating',
            succesfulRate: '$invitedBy.succesfulRate',
            averageCommission: '$invitedBy.averageCommission',
          },
        },
        { $unset: 'invitedBy' },
      ])
      .sort({
        date: -1,
      })
      .toArray();
  },
  getSent: async (userId: ObjectId) => {
    await client.connect();
    return collection
      .aggregate([
        {
          $match: {
            from: userId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: '_id',
            as: 'invitee',
          },
        },
        { $unwind: '$invitee' },
        {
          $addFields: {
            invitedById: '$_id',
            name: {
              $concat: ['$invitee.firstName', ' ', '$invitee.lastName'],
            },
            email: '$invitee.email',
            phone: '$invitee.phone',
            businessName: '$invitee.businessName',
            businessCategory: '$invitee.businessCategory',
            rating: '$invitee.rating',
            succesfulRate: '$invitee.succesfulRate',
            averageCommission: '$invitee.averageCommission',
          },
        },
        { $unset: 'invitee' },
      ])
      .sort({
        date: -1,
      })
      .toArray();
  },
  accept: async (inviteeId: ObjectId, invitationId: ObjectId) => {
    await client.connect();
    const result = collection.updateOne(
      {
        _id: invitationId,
        to: inviteeId,
      },
      {
        $set: {
          status: 'accepted',
          invitationId: invitationId,
          date: new Date(),
        },
      }
    );
    return result;
  },
  decline: async (inviteeId: ObjectId, invitationId: ObjectId) => {
    await client.connect();
    return collection.updateOne(
      {
        _id: invitationId,
        to: inviteeId,
      },
      {
        $set: {
          status: 'decline',
          invitationId: invitationId,
          date: new Date(),
        },
      }
    );
  },
};

export default Invitation;
