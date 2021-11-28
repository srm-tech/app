import { getDb, ObjectId } from '@/lib/db';
const { client, collection } = getDb('businessInvitations');

const BusinessInvitations = {
  inviteGuruNonMember: async (data) => {
    await client.connect();
    return await collection.insertOne(data);
  },
};

export default BusinessInvitations;
