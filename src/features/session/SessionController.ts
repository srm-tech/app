import { getCookie, setCookies } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

import { sendMail } from '@/lib/emails';
import { env } from '@/lib/envConfig';
import { HttpError } from '@/lib/error';
import HttpStatusCode from '@/lib/httpStatus';
import { Router } from '@/lib/router';
import { check, validate } from '@/lib/validator';

import { signInTemplate } from './emailTemplates';
import {
  decodeToken,
  getJWT,
  getRefreshToken,
  getVerifyToken,
  verifyDecodeToken,
} from './jwt';
import { appCookie } from './jwt';
import { SessionModel } from './SessionModel';
import UserModel from '../user/UserModel';

const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([check('accessToken').isJWT()])(req, res);
  const accessToken = getCookie('accessToken', { req, res });
  // decode JWT accessToken and send it back to the client
  try {
    const decodedToken = verifyDecodeToken(accessToken);
    res.json({
      _id: decodedToken['_id'],
      email: decodedToken['email'],
      expiresAt: decodedToken['exp'],
    });
  } catch (error) {
    // if jwt expired send 401
    throw new HttpError(HttpStatusCode.UNAUTHORIZED, (error as Error).message);
  }
};

const refreshSession = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([check('refreshToken').isMD5(), check('accessToken').isJWT()])(
    req,
    res
  );

  const accessToken = getCookie('accessToken', { req, res });
  const refreshToken = getCookie('refreshToken', { req, res });
  const sessionModel = await SessionModel();
  const users = await UserModel();

  // decode JWT accessToken and verify
  const decodedToken = decodeToken(accessToken);
  const email = decodedToken?.['email'];

  const hasRefreshToken = await sessionModel.verify({
    token: refreshToken,
    type: 'refreshToken',
  });

  if (!hasRefreshToken || !email) {
    throw new HttpError(HttpStatusCode.UNAUTHORIZED);
  }

  // remove old refresh token
  await sessionModel.remove({
    type: 'refreshToken',
    token: refreshToken,
  });

  // get new tokens
  const newRefreshToken = getRefreshToken();
  await sessionModel.create({
    token: newRefreshToken.token,
    expiresAt: newRefreshToken.expiresAt,
    type: 'refreshToken',
  });

  const user = await users.get({
    email,
  });
  const newAccessToken = await getJWT(user);

  // set cookies
  setCookies('refreshToken', newRefreshToken.token, { ...appCookie, req, res });
  setCookies('accessToken', newAccessToken.token, { ...appCookie, req, res });
  res.json({
    token: newAccessToken.token,
    expiresAt: newAccessToken.expiresAt,
  });
};

const createSession = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([check('email').isEmail()])(req, res);
  const email = req.body.email;

  const sessionModel = await SessionModel();
  const { token, expiresAt } = getVerifyToken();
  const { insertedId: sessionId } = await sessionModel.create({
    type: 'verification',
    token: token,
    expiresAt,
  });
  let url = `${env.BASE_URL}/api/session/callback?token=${token}&email=${email}`;
  if (req.query.redirectUrl) {
    url = `${url}?redirectUrl=${req.query.redirectUrl}`;
  }
  const data = {
    url,
    host: env.BASE_URL,
    email,
  };

  const mailData = {
    from: env.EMAIL_FROM,
    to: email,
    subject: `Sign in to introduce.guru`,
    // text: text(req.body),
    html: signInTemplate(data),
  };
  sendMail(mailData);
  res.json({ ok: true });
};

const deleteSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionModel = await SessionModel();
  const refreshToken = getCookie('accessToken', { req, res });
  await sessionModel.remove({
    type: 'refreshToken',
    token: refreshToken,
  });

  setCookies('refreshToken', '', { ...appCookie, req, res });
  setCookies('accessToken', '', { ...appCookie, req, res });

  res.json({ ok: true });
};

const validateVerifyToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await validate([check('token').isHash('md5'), check('email').isEmail()])(
    req,
    res
  );
  let query = `?token=${req.query.token}`;
  const sessionModel = await SessionModel();
  const users = await UserModel();
  const tokenRemoved = await sessionModel.remove({
    token: req.query.token,
    type: 'verification',
  });

  let error = '';
  await users.upsert({
    email: req.query.email.toString(),
  });
  const user = await users.get({
    email: req.query.email.toString(),
  });
  const { token: refreshToken, expiresAt } = getRefreshToken();
  await sessionModel.create({
    token: refreshToken,
    expiresAt,
    type: 'refreshToken',
  });
  const { token: accessToken } = await getJWT({
    _id: user?._id.toString(),
    email: user?.email,
  });

  if (tokenRemoved.deletedCount > 0) {
    setCookies('refreshToken', refreshToken, { ...appCookie, req, res });
    setCookies('accessToken', accessToken, { ...appCookie, req, res });
  } else {
    error = '&error=invalidToken';
  }
  res.redirect(
    302,
    req.query.redirectUrl
      ? `${req.query.redirectUrl}${query}${error}`
      : `/app/session/verify${query}${error}`
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const router = new Router(req, res);

  // retrieve session status and user id / email from jwt token
  await router.get('/session', getSession);

  // sends email with callback url for verification
  await router.post('/session', createSession);

  // remove access for the client, cleanup cookies and refresh token
  await router.delete('/session', deleteSession);

  // client will be pooling this endpoint to check for use of verification email
  await router.get('/session/callback', validateVerifyToken);

  // refresh access token for the client
  await router.get('/session/refresh', refreshSession);

  res.status(HttpStatusCode.NOT_FOUND).end();
};

export default handler;
