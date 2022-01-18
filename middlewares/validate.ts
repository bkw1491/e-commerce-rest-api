import { toError } from '@utils/response';
import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';


export function validate(schema: ZodTypeAny, mode: "body" | "params") {

  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      //parse schema async in case validation hits db
      //sometimes schema may mutate the request
      if(mode === 'body') { req.body = await schema.parseAsync(req.body) }
      if(mode === 'params') { await schema.parseAsync(req.params) }
      
      //move to next middleware if schema passes
      next();
    }

    catch(err: unknown){
      //validation error, parse error
      if(err instanceof ZodError) {
        //bad request
        const errors = err.issues.map(issue => {
          //format the error into a readable form 
          return `${issue.path[0] ? issue.path[0] + " field " : ""}${issue.message.toLowerCase()}`
        });
        //covert to response obj, with error = true
        return res.status(400).send(toError(errors))
      }
      //some other unexpected error pass to error handler
      next(err);
    }
  } 
}