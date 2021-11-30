const BusinessInvitations = (collection) => ({
  inviteGuruNonMember: async (data) => {
    return await collection.insertOne(data);
  },
});

export default BusinessInvitations;
