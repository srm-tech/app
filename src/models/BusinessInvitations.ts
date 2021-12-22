import { Collection } from 'mongodb';

const BusinessInvitations = (collection: Collection<Document>) => ({
  inviteGuruNonMember: async (data) => {
    return await collection.insertOne(data);
  },
});

export default BusinessInvitations;
