import { NextApiRequest, NextApiResponse } from 'next';

import Message from '@/models/Messages';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const user = getCurrentUser();
    if (req.method !== 'POST') {
      res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
    }
    const result = await Message.toggleRead(req.messageId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
