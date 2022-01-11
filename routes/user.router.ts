import express from 'express';
import { validate } from '@middlewares/validate';

import { Request, Response, NextFunction} from 'express';
import { UserSchema } from '@schemas/user.schema';
import { UserModel } from '@models/user.model';
import { issue } from '@utils/token';
import { toResponse } from '@utils/response';

//intialize user router
export const userRouter = express.Router();


userRouter.post("/register", validate(UserSchema.register, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from user model
    const newUser = await UserModel.createOne(req.body);
    //send the response
    res.status(201).send(toResponse(newUser));
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});


userRouter.post("/auth", validate(UserSchema.auth, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from util
    const token = issue(req.body)
    //set the token on the auth header
    res.setHeader("authorization", token);
    //send the token in the response
    res.status(200).send(toResponse(token));
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});