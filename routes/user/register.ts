import express from 'express';

import { Request, Response } from 'express';
import { validate } from '@middlewares/validate';
import { UserSchema } from '@schemas/user';
import { UserModel } from '@models/User';
import { toResponse } from '@utils/response';


export const registerRouter = express.Router();


//register a new user
registerRouter.post(
  "/", 
  validate(UserSchema.register, "body"), 
  async (req: Request, res: Response) => {

    const newUser = await UserModel.createOne(req.body);

    res.status(201).send(toResponse(newUser));
  });