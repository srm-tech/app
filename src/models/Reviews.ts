import { Collection } from 'mongodb';

import { ObjectId } from '@/lib/db';

const Review = (collection: Collection<Document>) => ({
  create: async (data) => {
    data.date = new Date();
    return collection.updateOne(
      {
        guru: data.guru,
        business: data.business,
        jobId: data.jobId,
      },
      {
        $set: data,
      },
      {
        upsert: true,
      }
    );
  },
});

export default Review;
