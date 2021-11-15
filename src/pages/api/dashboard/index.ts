// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

export default function index(req: NextApiRequest, res: NextApiResponse) {
  const networkGrowth = {};
  const introductions = {};
  const invitations = {};
  const connections = {};

  res.status(200).json({
    networkGrowth: networkGrowth,
    introductions: introductions,
    invitations: invitations,
    connections: connections,
  });
}
