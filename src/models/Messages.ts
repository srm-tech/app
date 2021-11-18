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
  toggleRead: async (messageId: ObjectId) => {
    const message = collection.updateOne(
      { _id: messageId },
      { $bit: { read: { xor: NumberInt(1) } } },
      { upsert: false, returnNewDocument: true }
    );
  },
};

export default Message;
