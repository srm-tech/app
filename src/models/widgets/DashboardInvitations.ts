import { Collection } from 'mongodb';

const DashboardInvitationsWidget = (collection: Collection<Document>) => ({
  get: async ({ userId }) => {
    const invitationsSent = await collection.find({ from: userId }).count();
    const invitationsReceived = await collection.find({ to: userId }).count();
    return {
      invitationsSent: invitationsSent,
      invitationsReceived: invitationsReceived,
    };
  },
});

export default DashboardInvitationsWidget;
