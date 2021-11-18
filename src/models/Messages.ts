import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('messages');

const Message = {
  readMany: async (userId: ObjectId) => {
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
            as: 'sentBy',
          },
        },
        {
          $project: {
            'sentBy.firstName': true,
            'sentBy.lastName': true,
            'sentBy.businessName': true,
            read: true,
          },
        },
        {
          $unwind: '$sentBy',
        },
      ])
      .sort({
        date: -1,
      })
      .toArray();
  },
  deleteOne: async (userId: ObjectId, messageId: ObjectId) => {
    await client.connect();
    const isAllowed = await collection
      .find({
        _id: messageId,
        to: userId,
      })
      .count();
    if (isAllowed === 0) {
      return null;
    }
    return await collection.deleteOne({ _id: messageId, to: userId });
  },
  toggleRead: async (userId: ObjectId, messageId: ObjectId) => {
    await client.connect();
    const isAllowed = await collection
      .find({
        _id: messageId,
        to: userId,
      })
      .count();
    if (isAllowed === 0) {
      return null;
    }
    const message = await collection.updateOne(
      { _id: messageId },
      {
        $bit: {
          read: { xor: 1 },
        },
      },
      { upsert: false, returnNewDocument: true }
    );
    return message;
  },
};

export default Message;
