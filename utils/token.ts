import log from '@utils/logger';
import jwt from 'jsonwebtoken';

import { Jwt, Secret } from 'jsonwebtoken';
import { IUser } from "@interfaces/IUser";


export function issue(user: IUser) {

  //payload for the jwt
  const payload = {
    iss: process.env.JWT_ISSUER,
    sub: user.id,
    admin: user.admin
  };
  //signing options for jwt
  const options = {
    expiresIn: process.env.JWT_EXPIRY
  }
  //sign the token and set expiry time
  const token = 
    jwt.sign(payload, process.env.JWT_SECRET as Secret, options);
  //log that a user has been authed
  log(`User ${payload.sub} Was Authenticated`)
  //return the token prefixed with Bearer 
  return `Bearer ${token}`;
}


export function verify(authCookie: string)  {

  try {
    //token comes in the form Bearer <token>
    const token = authCookie.split(' ')[1];
    //verify token with secret key, throws error if invalid
    const decoded = 
      jwt.verify(token, process.env.JWT_SECRET as Secret, {complete: true});
    //need to return token to check admin status later
    return decoded as Jwt;
  }

  catch(err: unknown) {
    //token not provided or is invalid, return falsey value
    return null;
  }
}