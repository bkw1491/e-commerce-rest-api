import log from '@utils/logger';

import { Request, Response } from 'express';


export function errorHandler(err: any, req: Request, res: Response) {
  //log the error to the console
  log(err.message);
  //return error to user
  res.status(500).send("An Unexpected Error Occurred");
}