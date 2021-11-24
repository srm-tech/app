module.exports = {
  rewrites: () => [
    {
      source: '/api/register/:path*',
      destination:
        'https://hook.integromat.com/ndb1abbohl44oi2xsn23lhb7a1pvh3n5',
    },
  ],
  eslint: {
    dirs: ['src'],
  },
  // frontend to access env
  env: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    CURRENCY: process.env.CURRENCY || "AUD",
  }
};
