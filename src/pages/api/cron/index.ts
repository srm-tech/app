import { NextApiRequest, NextApiResponse } from 'next';

import models from '@/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await models.client.connect();

    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.SECRET}`) {
        const intros = await models.Introduction.waitingForGuru();
        for (const intro of intros) {
          console.log(intro);
        }
        res.status(200).json({ success: true, result: intros });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
  await models.client.close();
}
