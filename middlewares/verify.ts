import { constructEvent } from '@utils/stripe';
import { verify } from '@utils/token';
import { Request, Response, NextFunction } from 'express';


export function verifyJWT(protection: "admin" | "user") {

  return (req: Request, res: Response, next: NextFunction) => {
    //return unauthorized if auth cookie not provided
    if(!req.cookies.auth) { return res.sendStatus(401) }
    //verify the token, returns extracted token if valid
    const token = verify(req.cookies.auth!)
    //send 401 if token verification fails
    if(!token) { return res.sendStatus(401) }
    //if the route requires admin and user not admin return 401
    if(protection === "admin") {
      if(!token.payload.admin) { return res.sendStatus(401) }
    }
    //atatch user_id to req body, makes life easier later on
    req.body.user_id = token.payload.sub;
    //move to next middleware
    next();
  }
}


export function verifyWebhook() {
  //as per stripe docs, verifies req is coming from stripe
  return ((req: Request, res: Response, next: NextFunction) => {
    //get the stripe signature from req header
    const signature = req.headers['stripe-signature'];
    //if no signature, return unauthorized
    if(!signature) { return res.sendStatus(401) }
    //constructEvent will throw if invalid
    try {
      //attempt to verify the signature
      req.body = constructEvent(req.body, signature as string);
      //return to the router
      next();
    }

    catch(err) {
      //auth failed
      res.status(401).send(err);
    }
  })
}