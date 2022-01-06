import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import getCollections from '@/models';
import type { UserProfile } from '@/models/UserProfiles';

import { HttpError } from './error';
import users from '@/pages/api/users';

export default async function getCurrentUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const email = session?.user?.email;
  if (!session || !email) {
    throw new HttpError(401);
  }
  return { _id: session.user?._id, email };
}
