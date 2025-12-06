import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

// Auth0 JWT verification
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});

// Middleware to ensure auth is present
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth?.payload?.sub) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
