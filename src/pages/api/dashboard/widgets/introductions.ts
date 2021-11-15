import { NextApiRequest, NextApiResponse } from 'next';

export default function introductions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(200).json({
    introductions: 0,
  });
}
