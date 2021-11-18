import { getDb } from '@/lib/db';
const { client, collection } = getDb('connections');

const DashBoardConnectionsWidget = {
  get: async ({ userId }) => {
    await client.connect();
    const c1 =
      (await collection?.find({ user1: userId, status: 'completed' }).toArray())
        ?.length || 0;
    const c2 =
      (await collection?.find({ user2: userId, status: 'completed' }).toArray())
        ?.length || 0;
    return c1 + c2;
  },
};

export default DashBoardConnectionsWidget;
