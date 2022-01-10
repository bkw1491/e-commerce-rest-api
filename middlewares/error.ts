import log from '@utils/logger';

import { Request, Response } from 'express';
import { toResponse } from '@utils/response';


export function errorHandler(err: any, req: Request, res: Response) {
  //log the error to the console
  log(err.message);
  //return error to user
  res.status(500).send(toResponse("An Unexpected Error Occurred", true));
}