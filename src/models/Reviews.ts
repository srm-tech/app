import { ObjectId } from '@/lib/db';
import { Collection } from 'mongodb';

const Review = (collection: Collection<Document>) => ({
  create: async (data) => {
    data.reviewedId = new ObjectId(data.reviewedId);
    return collection.insertOne(data);
  },
});

export default Review;
