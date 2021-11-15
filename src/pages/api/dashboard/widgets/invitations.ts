import { NextApiRequest, NextApiResponse } from 'next';

export default function invitations(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    invitations: 0,
  });
}
