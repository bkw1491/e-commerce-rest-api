import jwt, { Secret } from 'jsonwebtoken';
import { IUser } from "schema/user.schema";


export function issue(user: IUser) : string {

  //payload for the jwt
  const payload = {
    iss: process.env.JWT_ISSUER,
    sub: user.id,
  };
  //signing options for jwt
  const options = {
    expiresIn: process.env.JWT_EXPIRY
  }
  //sign the token with 4hr expiry time
  const token = 
    jwt.sign(payload, process.env.JWT_SECRET as Secret, options);
  //return the token interpolated with Bearer 
  return `Bearer ${token}`;
}

export function verify(authHeader: string) : boolean {

  try {
    //get the token from the header
    const token = authHeader.split(' ')[1];
    //verify the token with the secret key
    jwt.verify(token, process.env.JWT_SECRET as Secret);
    //token successfully verified
    return true;
  }

  catch(err: unknown) {
    //token not provided or is invalid
    return false;
  }
}