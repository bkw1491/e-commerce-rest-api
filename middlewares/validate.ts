import log from '@utils/logger';
import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';


export function validateBody(schema: ZodTypeAny) {

  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      //parse schmea async in case validation hits db
      await schema.parseAsync(req.body)
      //move to next middleware if schema passes
      next();
    }

    catch(err: unknown){

      res.status(400).send(err);
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

      res.status(400).send(err);
    }
  }
}