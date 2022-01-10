import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';


export function validate(schema: ZodTypeAny, method: "params" | "body") {
  //return a function
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      //parse schema async in case validation hits db
      await schema.parseAsync(method === "params" ? req.params : req.body)
      //move to next middleware if schema passes
      next();
    }

    catch(err: unknown){
      //validation error, parse error
      if(err instanceof ZodError) {
        //bad request
        const errors = err.issues.map(issue => {
          return {
            code: issue.code,
            message: `${issue. path[0]}: ${issue.message}`,
          }
        })
        return res.status(400).send(errors)
      }
      //some other unexpected error pass to error handler
      next(err)
    }
  } 
}