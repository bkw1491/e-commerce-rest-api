import { verify } from '@utils/token';
import { Request, Response, NextFunction } from 'express';

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  //return unauthorized if header not provided
  if(!req.headers.authorization) { return res.sendStatus(401) }
  //verify the token, returns extracted token if valid
  const token = verify(req.headers.authorization!)
  //send 401 if token verification fails
  if(!token) { return res.sendStatus(401) }
  //atatch user_id to req body
  req.body.user_id = token.payload.sub;
  //next middleware
  next();
}