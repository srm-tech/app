import { getCookie } from 'cookies-next';
import { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import { check, validate } from '@/lib/validator';

import { verifyDecodeToken } from './jwt';

export const auth = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string | JwtPayload> => {
  await validate([check('accessToken').isJWT()])(req, res);
  const accessToken = getCookie('accessToken', { req, res });
  // decode JWT accessToken and send it back to the client
  return verifyDecodeToken(accessToken);
};
