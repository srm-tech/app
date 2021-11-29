const DashBoardConnectionsWidget = (collection) => ({
  get: async ({ userId }) => {
    const c1 =
      (await collection.find({ user1: userId, status: 'completed' }).toArray())
        ?.length || 0;
    const c2 =
      (await collection.find({ user2: userId, status: 'completed' }).toArray())
        ?.length || 0;
    return c1 + c2;
  },
});

export default DashBoardConnectionsWidget;
