import log from '@utils/logger';
import jwt from 'jsonwebtoken';

import { Jwt, Secret } from 'jsonwebtoken';
import { IUser } from "@interfaces/IUser";


export function issue(user: IUser) : string {

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
  //sign the token with expiry time
  const token = 
    jwt.sign(payload, process.env.JWT_SECRET as Secret, options);
  //log that a user has been authed
  log(`User ${payload.sub} Was Authenticated`)
  //return the token interpolated with Bearer 
  return `Bearer ${token}`;
}


export function verify(authHeader: string) : Jwt | null  {

  try {
    //get the token from the header
    const token = authHeader.split(' ')[1];
    //verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret, {complete: true});
    //token successfully verified
    return decoded as Jwt;
  }

  catch(err: unknown) {
    //token not provided or is invalid
    return null;
  }
}