// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

import { fetchGetJSON } from '@/lib/api-helpers';

export default function index(req: NextApiRequest, res: NextApiResponse) {
  const networkGrowth = fetchGetJSON('/api/dashboard/widgets/networkGrowth');
  const introductions = fetchGetJSON('/api/dashboard/widgets/introductions');
  const invitations = fetchGetJSON('/api/dashboard/widgets/invitations');
  const connections = fetchGetJSON('/api/dashboard/widgets/connections');

  res.status(200).json({
    networkGrowth: networkGrowth,
    introductions: introductions,
    invitations: invitations,
    connections: connections,
  });
}
