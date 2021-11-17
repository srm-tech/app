import { getDb } from '@/lib/db';
const { client, collection } = getDb('introductions');

const DashboardIntroductionsWidget = {
  get: async ({ userId }) => {
    await client.connect();
    const introductionsPending = await collection
      .find({ to: userId, status: 'pending' })
      .count();
    const introductionsCompleted = await collection
      .find({ to: userId, status: 'completed' })
      .count();
    const introductionsAcccepted = await collection
      .find({ to: userId, status: 'accepted' })
      .count();
    return {
      introductionsPending: introductionsPending,
      introductionsCompleted: introductionsCompleted,
      introductionsAcccepted: introductionsAcccepted,
    };
  },
};

export default DashboardIntroductionsWidget;
