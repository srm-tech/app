import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Message = (collection: Collection<Document>) => ({
  create: async (data: any) => {
    return collection.insertOne({
      from: data.userId,
      date: new Date(),
      read: 0,
      to: new ObjectId(data.to),
      subject: data.subject,
      content: data.content,
    });
  },
  readMany: async (userId: ObjectId) => {
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
            subject: true,
            content: true,
            date: true,
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
  deleteOne: async (userId: ObjectId, messageId: string) => {
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
  toggleRead: async (userId: ObjectId, messageId: string) => {
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
});
export default Message;
