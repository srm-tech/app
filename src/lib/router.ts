import { NextApiRequest, NextApiResponse } from 'next';
import { matchPath } from 'react-router';

import { HttpError } from './error';

export class Router {
  req: NextApiRequest;
  res: NextApiResponse;
  path: string;
  pathPrefix: string = '/api';
  handleErrorOption: boolean;

  constructor(
    req: NextApiRequest,
    res: NextApiResponse,
    options?: { handleError: boolean }
  ) {
    this.req = req;
    this.res = res;
    this.path = `${req?.url}`;
    this.handleErrorOption = options?.handleError || true;
  }

  async handleError(callback) {
    try {
      await callback(this.req, this.res);
    } catch (e) {
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
    return null;
  }

  checkPath(path) {
    return matchPath(`${this.pathPrefix}${path}`, this.path.split('?')[0]);
  }

  async validateRequest(method, path, callback) {
    console.log(this.req.method === method);
    console.log(this.checkPath(path));

    if (this.req.method === method && this.checkPath(path)) {
      return this.handleErrorOption
        ? await this.handleError(callback)
        : await callback(this.req, this.res);
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
