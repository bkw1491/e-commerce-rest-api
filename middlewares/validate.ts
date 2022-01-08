import log from '@utils/logger';

import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';


export function validateBody(schema: ZodTypeAny) {

  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      console.dir(req.body)
      //parse schema async in case validation hits db
      //set req body to the return in case the body is mutated
      req.body = await schema.parseAsync(req.body)
      //move to next middleware if schema passes
      next();
    }

    catch(err: unknown){
      //validation error, parse error
      if(err instanceof ZodError) {
        //bad request
        return res.status(400).send(err.issues)
      }
      //some other unexpected error pass to error handler
      next(err)
    }
  }
}

export function validateParams(schema: ZodTypeAny) {

  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      //parse schmea async in case validation hits db
      await schema.parseAsync(req.params)
      //move to next middleware if schema passes
      next();
    }

    catch(err: unknown){
      //validation error, parse error
      if(err instanceof ZodError) {
        //bad request
        return res.status(400).send(err.issues)
      }
      //some other unexpected error pass to error handler
      next(err)
    }
  }
}