import { getCollection, ObjectId } from '@/lib/db';
const { client, collection } = getCollection('invitations');

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
        {
          $project: {
            'invitedBy.firstName': true,
            'invitedBy.lastName': true,
            'invitedBy.businessName': true,
            status: true,
          },
        },
        {
          $unwind: '$invitedBy',
        },
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
            localField: 'to',
            foreignField: '_id',
            as: 'invitationSentTo',
          },
        },
        {
          $project: {
            'invitationSentTo.firstName': true,
            'invitationSentTo.lastName': true,
            'invitationSentTo.businessName': true,
            status: true,
          },
        },
        {
          $unwind: '$invitationSentTo',
        },
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
