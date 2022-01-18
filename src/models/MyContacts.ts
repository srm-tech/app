import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';
import { Agreement } from '@/features/introductions/QuickForm';

interface MyContact {
  userId: ObjectId;
  contactId: ObjectId;
  createdAt: Date;
  status: 'accepted' | 'pending' | 'declined';
  agreement: Agreement;
}

const MyContacts = (collection: Collection<MyContact>) => ({
  create: async ({
    userId,
    contactId,
    createdAt,
    status,
    agreement,
  }: MyContact) => {
    return collection.updateOne(
      {
        userId: userId,
        contactId: new ObjectId(contactId),
      },
      {
        $set: {
          userId: userId,
          contactId: new ObjectId(contactId),
          agreement,
          createdAt,
          status,
        },
      },
      {
        upsert: true,
      }
    );
  },

  readOne: async (userId, { contactId }) => {
    const string = `(${userId.toString()} ${contactId}|${contactId} ${userId.toString()})`;
    const query = new RegExp(string, 'i');
    const result = await collection
      .aggregate([
        {
          $addFields: {
            userRef: { $toString: '$userId' },
            contactRef: { $toString: '$contactId' },
          },
        },
        {
          $addFields: {
            search: {
              $concat: ['$userRef', ' ', '$contactRef'],
            },
          },
        },
        {
          $match: {
            search: { $regex: query },
            status: 'accepted',
          },
        },
        {
          $unset: ['userRef', 'contactRef', 'search'],
        },
      ])
      .toArray();
    return result[0];
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
        {
          $lookup: {
            from: 'reviews',
            localField: 'contactId',
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
            'contact.avgRate': { $avg: '$reviews.rate' },
            'contact.avgCommissionCustomer': {
              $avg: '$contact.commissionCustomer',
            },
            'contact.avgCommissionBusiness': {
              $avg: '$contact.commissionBusiness',
            },
          },
        },
        {
          $unset: [
            'contact.rating',
            'contact.succesfulRate',
            'contact.averageCommission',
            'contact.isActive',
            'contact.isGuru',
            'contact.isBusiness',
          ],
        },
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
