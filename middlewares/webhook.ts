import express from 'express';
import { Request, Response, NextFunction } from 'express';

export function webhook(req: Request, res: Response, next: NextFunction) {
    //if the req url is to a webhook endpoint, don't parse to json
    if (req.originalUrl === '/api/order/webhook')  { 

      next();
    } 
    //otherwise parse to json
    else { 

      express.json()(req,res, next);
    }
}