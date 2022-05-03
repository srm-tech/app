import { NextApiRequest, NextApiResponse } from 'next';
import { matchPath } from 'react-router';

import { JWTToken } from '@/features/session/jwt';

import { HttpError } from './error';
import HttpStatusCode from './httpStatus';
export class Router {
  req: NextApiRequest;
  res: NextApiResponse;
  auth?: (req: NextApiRequest, res: NextApiResponse) => JWTToken;
  user?: JWTToken;
  path: string;
  pathPrefix: string = '/api';
  handleErrorOption: boolean;

  constructor(
    req: NextApiRequest,
    res: NextApiResponse,
    options?: {
      handleError?: boolean;
      auth?: (req: NextApiRequest, res: NextApiResponse) => any;
    }
  ) {
    this.req = req;
    this.res = res;
    this.path = `${req?.url}`;
    if (options?.auth) {
      this.auth = options?.auth;
    }
    this.handleErrorOption = options?.handleError || true;
  }

  handleError(e) {
    console.error('IG Error:', e);
    const statusCode = (e as HttpError).statusCode || 500;
    this.res.status(statusCode).json({
      statusCode,
      message:
        statusCode === 500
          ? (e as HttpError).message || 'Oops, something went wrong.'
          : (e as HttpError).message,
    });
  }

  checkPath(path) {
    return matchPath(`${this.pathPrefix}${path}`, this.path.split('?')[0]);
  }

  async validateRequest(method, path, callback) {
    if (this.req.method === method && this.checkPath(path)) {
      if (this.auth) {
        try {
          this.user = await this.auth(this.req, this.res);
        } catch (error) {
          return this.res
            .status(HttpStatusCode.UNAUTHORIZED)
            .send({ message: (error as Error).message });
        }
      }
      if (this.handleErrorOption) {
        try {
          await callback(this.req, this.res, { ...this.user });
        } catch (e) {
          this.handleError(e);
        }
      } else {
        await callback(this.req, this.res, { ...this.user });
      }
    }
  }

  async get(path: string, callback) {
    return this.validateRequest('GET', path, callback);
  }
  async post(path: string, callback) {
    return this.validateRequest('POST', path, callback);
  }
  async delete(path: string, callback) {
    return this.validateRequest('DELETE', path, callback);
  }
  async put(path: string, callback) {
    return this.validateRequest('PUT', path, callback);
  }
}
