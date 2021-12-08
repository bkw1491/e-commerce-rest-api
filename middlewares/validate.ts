import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';


export default function(schema: ZodTypeAny) {

  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      //parse the schema async incase schema hits db
      await schema.parseAsync(req.body);
      //move to next middleware if schema passes
      next();
    }

    catch(err: unknown) {
      //pass error to error handling middleware
      next(err);
    }
  }
}