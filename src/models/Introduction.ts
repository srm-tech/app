import { getCollection, ObjectId } from '@/lib/db';
import { check, validate } from '@/lib/validator';
const { client, collection } = getCollection('introductions');

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  aboutTheJob: string;
  to: string;
  originalId: ObjectId;
  userId: ObjectId;
}

const Introduction = {
  readMany: async (userId: ObjectId) => {
    await client.connect();
    return collection.find({ userId }).toArray();
  },
  create: async (data) => {
    await client.connect();
    return collection.insertOne(data);
  },
  selectContacts: async (introductionId: ObjectId, userId: ObjectId, data) => {
    await client.connect();
    await validate([check('introductionId').isMongoId()]);
    const intro = await collection.findOne({
      _id: introductionId,
      userId: userId,
    });
    if (!intro) {
      return null;
    }
    const elements: Contact[] = [];
    for (let a = 0; a < data.length; a++) {
      const obj: Contact = {
        firstName: intro.firstName,
        lastName: intro.lastName,
        email: intro.email,
        mobile: intro.mobile,
        aboutTheJob: intro.aboutTheJob,
        to: data[a],
        originalId: intro._id,
        userId: userId,
      };
      elements.push(obj);
    }
    return collection.insertMany(elements);
  },
  send: async (introductionId: ObjectId, uId: ObjectId) => {
    await client.connect();
    return await collection.updateMany(
      { originalId: introductionId, userId: uId },
      {
        $set: {
          status: 'sent',
          date: new Date(),
        },
      }
    );
  },
};

export default Introduction;
