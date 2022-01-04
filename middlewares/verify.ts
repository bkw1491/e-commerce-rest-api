import express from 'express';

import { constructEvent } from '@utils/stripe';
import { verify } from '@utils/token';
import { Request, Response, NextFunction } from 'express';


export function verifyJWT(protection: "admin" | "user") {

  return (req: Request, res: Response, next: NextFunction) => {
    //return unauthorized if header not provided
    if(!req.headers.authorization) { return res.sendStatus(401) }
    //verify the token, returns extracted token if valid
    const token = verify(req.headers.authorization!)
    //send 401 if token verification fails
    if(!token) { return res.sendStatus(401) }
    //if the route requires admin and user not admin return 401
    if(protection === "admin") {
      if(!token.payload.admin) { return res.sendStatus(401) }
    }
    //atatch user_id to req body
    req.body.user_id = token.payload.sub;
    //next middleware
    next();
  }
}


export function verifyWebhook() {

  return ((req: Request, res: Response, next: NextFunction) => {
    //get the stripe signature from req header
    const signature = req.headers['stripe-signature'];
    //if no signature, return unauthorized
    if(!signature) { return res.sendStatus(401) }
    //verify the signature using webhook secret and signature
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