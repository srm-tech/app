import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';

const MyContacts = (collection: Collection<Document>) => ({
  create: async (data) => {
    data.date = new Date();
    return collection.insertOne(data);
  },
  readMany: async ({ userId }) => {
    const contacts = await collection
      .aggregate([
        {
          $match: {
            userId: userId,
            status: { $ne: 'declined' }, // don't get declined
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'contactId',
            foreignField: '_id',
            as: 'contact',
          },
        },
        {
          $unwind: '$contact',
        },
        // {
        //   $unionWith: {
        //     coll: 'myContacts',
        //     pipeline: [
        //       {
        //         $match: {
        //           contactId: userId,
        //         },
        //       },
        //       {
        //         $lookup: {
        //           from: 'userProfiles',
        //           localField: 'userId',
        //           foreignField: '_id',
        //           as: 'contact',
        //         },
        //       },
        //       {
        //         $unwind: '$contact',
        //       },
        //       {
        //         $set: {
        //           status: {
        //             $cond: [
        //               { $eq: ['$status', 'pending'] },
        //               'waiting for approval',
        //               '$status',
        //             ],
        //           },
        //         },
        //       },
        //     ],
        //   },
        // },
      ])
      .toArray();
    return contacts;
  },

  search: async ({ userId, query = '' }) => {
    return collection
      ?.aggregate([
        {
          $match: {
            userId: userId,
            status: { $ne: 'declined' }, // don't get declined
            search: { $regex: query, $options: 'i' },
          },
        },
        {
          $lookup: {
            from: 'userProfiles',
            localField: 'contactId',
            foreignField: '_id',
            as: 'contact',
          },
        },
        {
          $unwind: '$contact',
        },
        // {
        //   $unionWith: {
        //     coll: 'myContacts',
        //     pipeline: [
        //       {
        //         $match: {
        //           contactId: userId,
        //         },
        //       },
        //       {
        //         $lookup: {
        //           from: 'userProfiles',
        //           localField: 'userId',
        //           foreignField: '_id',
        //           as: 'contact',
        //         },
        //       },
        //       {
        //         $unwind: '$contact',
        //       },
        //       {
        //         $set: {
        //           status: {
        //             $cond: [
        //               { $eq: ['$status', 'pending'] },
        //               'waiting for approval',
        //               '$status',
        //             ],
        //           },
        //         },
        //       },
        //     ],
        //   },
        // },
      ])
      .toArray();
  },

  accept: async (invitationId: ObjectId, userId: ObjectId) => {
    const update = collection.updateOne(
      {
        _id: invitationId,
        userId: userId,
      },
      {
        $set: {
          status: 'accepted',
          date: new Date(),
        },
      }
    );
    return update;
  },
  decline: async (invitationId: ObjectId, userId: ObjectId) => {
    const update = collection.updateOne(
      {
        _id: invitationId,
        userId: userId,
      },
      {
        $set: {
          status: 'declined',
          date: new Date(),
        },
      }
    );
    return update;
  },
  toggleFav: async (contactId: ObjectId, userId: ObjectId) => {
    const update = collection.updateOne(
      {
        _id: contactId,
        userId: userId,
      },
      {
        $bit: {
          isFavourite: { xor: 1 },
        },
      }
    );
    return update;
  },
  addNew: async (contactId: ObjectId, userId: ObjectId) => {
    const update1 = await collection.updateOne(
      {
        contactId: contactId,
        userId: userId,
      },
      {
        $set: {
          contactId: contactId,
          userId: userId,
          status: 'accepted',
          date: new Date(),
          isFavourite: 0,
        },
      },
      {
        upsert: true,
      }
    );

    const update2 = await collection.updateOne(
      {
        contactId: userId,
        userId: contactId,
      },
      {
        $set: {
          contactId: userId,
          userId: contactId,
          status: 'accepted',
          date: new Date(),
          isFavourite: 0,
        },
      },
      {
        upsert: true,
      }
    );
    return {
      obj1: update1,
      obj2: update2,
    };
  },
});

export default MyContacts;
