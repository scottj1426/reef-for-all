import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        payload: {
          sub: string;
          [key: string]: any;
        };
      };
    }
  }
}
