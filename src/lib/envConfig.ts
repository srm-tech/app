export const env = {
  DB_URI: process.env.DB_URI,
  DB_NAME: process.env.DB_NAME || 'guru',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  EMAIL_FROM:
    process.env.EMAIL_FROM || 'Introduce Guru <support@introduce.guru>',
  IS_DEV: process.env.NODE_ENV !== 'production',
  CURRENCY: process.env.CURRENCY || 'USD',
  STRIPE_SUCCESS_PAGE:
    process.env.STRIPE_SUCCESS_PAGE || 'integrations/stripe/success',
  STRIPE_CANCEL_PAGE: process.env.STRIPE_CANCEL_PAGE || 'promotion',
  TRANSACTION_FEE: process.env.TRANSACTION_FEE || 0.03, // 3% of the total payment
};
