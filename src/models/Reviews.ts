import { ObjectId } from '@/lib/db';

const Review = (collection) => ({
  create: async (data) => {
    data.reviewedId = new ObjectId(data.reviewedId);
    return collection.insertOne(data);
  },
});

export default Review;
