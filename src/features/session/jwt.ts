import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

// import { v4 as uuid } from 'uuid';
import { env } from '@/lib/envConfig';

export interface Token {
  token: string;
  expiresAt: Date;
  otp?: string;
}
export interface JWTToken {
  _id: string;
  status?: string;
  role?: string;
  email?: string;
}

export enum TokenTypes {
  REFRESH_TOKEN = 'refreshToken',
  VERIFY_TOKEN = 'verifyToken',
  ACCESS_TOKEN = 'accessToken',
}

export const appCookie = {
  domain: env.DOMAIN,
  secure: env.BASE_URL.includes('https://'),
  httpOnly: true,
};

export const getExpiryDate = (days: number): Date => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + Number(days));
  return expiresAt;
};

export const getVerifyToken = (text?: string): Token => {
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  const token = crypto
    .createHash('md5')
    .update(text || otp)
    .digest('hex');
  return {
    otp,
    token,
    expiresAt: getExpiryDate(Number(env.VERIFY_TOKEN_EXPIRY_DAYS)),
  };
};

export const getRefreshToken = (): Token => {
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  const token = crypto.createHash('md5').update(otp).digest('hex');
  return {
    token,
    expiresAt: getExpiryDate(env.REFRESH_TOKEN_EXPIRY_DAYS),
  };
};

export const generateJWTToken = (
  expiry: string,
  secret: string,
  user?: JWTToken
): Promise<{ jwtToken: string; exp: number }> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: user?._id,
        status: user?.status,
        role: user?.role,
        email: user?.email,
      },
      secret,
      { expiresIn: expiry },
      (err, jwtToken) => {
        if (err) return reject(err);
        jwt.verify(`${jwtToken}`, secret, (err, verify) => {
          return resolve({
            jwtToken: `${jwtToken}`,
            exp: verify?.['exp'], // seconds
          });
        });
      }
    );
  });
};

export const getJWT = async (user) => {
  const { jwtToken: accessToken, exp } = await generateJWTToken(
    `${env.ACCESS_TOKEN_EXPIRY_MINUTES} minutes`,
    env.ACCESS_TOKEN_SECRET,
    user
  );
  return {
    token: accessToken,
    expiresAt: exp,
  };
};

export const verifyDecodeToken = (token): string | JwtPayload => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};
export const decodeToken = (token): null | string | JwtPayload => {
  return jwt.decode(token);
};
