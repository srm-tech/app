import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import models from '@/models';
import type { UserProfile } from '@/models/UserProfiles';

export default async function getCurrentUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  await models.client.connect();
  const user = (await models.UserProfile.getOneByEmail(
    session?.user?.email
  )) as UserProfile | null;
  return user;
}
