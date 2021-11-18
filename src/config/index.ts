const dev = process.env.NODE_ENV !== 'production';
export const DEV = dev ? true : false;
export const SERVER = dev ? 'http://localhost:3000' : 'https://introduce.guru/';
export const CURRENCY = 'aud'; // Australian dollars, unless you want USD
export const STRIPE_SUCCESS_PAGE = 'integrations/stripe/success';
export const STRIPE_CANCEL_PAGE = 'promotion';
