import { Collection } from 'mongodb';

const DashboardIntroductionsWidget = (collection: Collection<Document>) => ({
  get: async ({ userId }) => {
    const introductionsPending = await collection
      ?.find({ to: userId, status: 'pending' })
      .count();
    const introductionsCompleted = await collection
      ?.find({ to: userId, status: 'completed' })
      .count();
    const introductionsAccepted = await collection
      ?.find({ to: userId, status: 'accepted' })
      .count();
    return {
      introductionsPending: introductionsPending,
      introductionsCompleted: introductionsCompleted,
      introductionsAccepted: introductionsAccepted,
    };
  },
});

export default DashboardIntroductionsWidget;
