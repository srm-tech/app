const dev = process.env.NODE_ENV !== 'production';
export const DEV = dev ? true : false;
export const SERVER = dev ? 'http://localhost:3000' : 'https://introduce.guru/';
