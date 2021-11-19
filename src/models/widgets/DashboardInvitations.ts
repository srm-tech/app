import { getDb } from '@/lib/db';
const { client, collection } = getDb('invitations');

const DashboardIntroductionsWidget = {
  get: async ({ userId }) => {
    await client.connect();
    const invitationsSent = await collection?.find({ from: userId }).count();
    const invitationsReceived = await collection?.find({ to: userId }).count();
    return {
      invitationsSent: invitationsSent,
      invitationsReceived: invitationsReceived,
    };
  },
};

export default DashboardIntroductionsWidget;
