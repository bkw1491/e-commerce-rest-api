import log from '@utils/logger';

import { NextFunction, Request, Response } from 'express';
import { toResponse } from '@utils/response';


export function errorHandler(
  err: any, _req: Request, res: Response, _next: NextFunction) {
  //log the error to the console
  log(`${err.name} (${err.message})`);
  //return error to user
  res.status(500).send(toResponse("internal server error"));
}