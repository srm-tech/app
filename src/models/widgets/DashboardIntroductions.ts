import { getDb } from '@/lib/db';
const { client, collection } = getDb('introductions');

const DashboardIntroductionsWidget = {
  get: async ({ userId }) => {
    await client.connect();
    const introductionsPending = collection
      .aggregate([
        {
          $match: {
            to: userId,
            status: 'pending',
          },
        },
        {
          $count: 'count',
        },
      ])
      .toArray();
    return {
      introductionsPending: introductionsPending,
    };
  },
};

export default DashboardIntroductionsWidget;
