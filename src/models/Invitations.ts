import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Invitation = (collection: Collection<Document>) => ({
  getReceived: async (userId: ObjectId) => {
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
            successfulRate: '$invitedBy.successfulRate',
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
            successfulRate: '$invitee.successfulRate',
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
  accept: async (inviteeId, invitationId) => {
    const result = collection.updateOne(
      {
        _id: invitationId,
        contactId: inviteeId,
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
  decline: async (inviteeId, invitationId) => {
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
});
export default Invitation;
