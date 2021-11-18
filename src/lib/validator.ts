import { check, validationResult } from 'express-validator';
import { initMiddleware, validateMiddleware } from '@/lib/middleware';

export const validate = (params) =>
  initMiddleware(validateMiddleware(params, validationResult));

export { check };
