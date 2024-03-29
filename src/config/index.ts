export const env = {
  BASE_URL: process.env.BASE_URL,
  IS_DEV: process.env.NODE_ENV !== 'production',
  CURRENCY: process.env.CURRENCY,
  STRIPE_SUCCESS_PAGE: 'integrations/stripe/success',
  STRIPE_CANCEL_PAGE: 'promotion',
};
