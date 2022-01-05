import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import getCollections from '@/models';
import type { UserProfile } from '@/models/UserProfiles';

import { HttpError } from './error';

export default async function getCurrentUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user?.email) {
    throw new HttpError(401);
  }
  const { UserProfile } = await getCollections();
  const user = (await UserProfile.getOneByEmail(
    session.user.email
  )) as UserProfile;
  if (!user) {
    throw new HttpError(401);
  }
  return user;
}
