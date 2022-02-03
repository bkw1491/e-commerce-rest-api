import { Request, Response, NextFunction } from 'express';

//TODO don't like type any here
//can wrap async req, res, next with this, avoids try catch everywhere
//credit: https://stackoverflow.com/questions/51391080 handling-errors-in-express-async-middleware
export const asyncHandler = (fn: any) => 
(req: Request, res: Response, next: NextFunction) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};