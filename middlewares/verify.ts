import { verify } from '@utils/token';
import { Request, Response, NextFunction } from 'express';

export function verifyJWT(req: Request, res: Response, next: NextFunction) {

  //return unauthorized if header not provided
  if(!req.headers.authorization) { res.sendStatus(401) }
  //send 401 if token verification fails
  if(!verify(req.headers['authorization']!)) { res.sendStatus(401) }
  //next middleware
  next();
}