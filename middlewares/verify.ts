import { verify } from '@utils/token';
import { Request, Response, NextFunction } from 'express';

export function verifyJWT(req: Request, res: Response, next: NextFunction) {

  

  //return unauthorized if header not provided
  if(!req.headers.authorization) { res.sendStatus(401) }
  //verify the token, returns extracted token if valid
  const token = verify(req.headers['authorization']!)
  //send 401 if token verification fails
  if(!token) { res.sendStatus(401) }

  console.log(token);
  
  //next middleware
  next();
}