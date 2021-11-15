import { NextApiRequest, NextApiResponse } from 'next';

export default function connections(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    connections: 0,
  });
}
