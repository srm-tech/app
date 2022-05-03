export const env = {
  DB_URI: process.env.DB_URI,
  DB_NAME: process.env.DB_NAME || 'guru',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  DOMAIN: '',
  SECRET: process.env.SECRET || 'secretSantaXOXO',
  EMAIL_SERVER_HOST:
    process.env.EMAIL_SERVER_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || 587,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || '',
  EMAIL_SERVER_PASS: process.env.EMAIL_SERVER_PASS || '',
  EMAIL_SECURE: process.env.EMAIL_SECURE || false,
  EMAIL_FROM:
    process.env.EMAIL_FROM || 'Introduce Guru <support@introduce.guru>',
  IS_DEV: process.env.NODE_ENV !== 'production',
  CURRENCY: process.env.CURRENCY || 'USD',
  STRIPE_SUCCESS_PAGE:
    process.env.STRIPE_SUCCESS_PAGE || 'integrations/stripe/success',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_CANCEL_PAGE: process.env.STRIPE_CANCEL_PAGE || 'promotion',
  TRANSACTION_FEE: process.env.TRANSACTION_FEE || 0.05, // 3% of the total payment
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  VERIFY_TOKEN_EXPIRY_DAYS: 1,
  REFRESH_TOKEN_EXPIRY_DAYS: 180,
  ACCESS_TOKEN_EXPIRY_MINUTES:
    process.env.NODE_ENV === 'production' ? 10 : 7 * 12 * 60,
  ACCESS_TOKEN_SECRET: 'secretFantom#1',
};

env.DOMAIN = env.BASE_URL.split('//')[1].split(':')[0];

if (typeof window !== undefined) {
  console.info(process.env.NODE_ENV);
  // console.info(env);
}
