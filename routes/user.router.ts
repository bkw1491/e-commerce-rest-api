import express from 'express';

import { Request, Response, NextFunction} from 'express';
import { validate } from '@middlewares/validate';
import { UserSchema } from '@schemas/user.schema';
import { UserModel } from '@models/user.model';
import { issue } from '@utils/token';
import { toResponse } from '@utils/response';

//intialize user router
export const userRouter = express.Router();


userRouter.post("/register", validate(UserSchema.register), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from user model
    const newUser = await UserModel.createOne(req.body);
    //send the response
    res.status(201).send(toResponse(newUser));
  }

  catch(err: unknown) {

    next(err)
  }
});


userRouter.post("/auth", validate(UserSchema.auth), 
  async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from util to create a json web token
    const token = issue(req.body)
    //http only prevents client-side javascript from accessing the cookie
    //no sensitive info is stored in the cookie anyway
    //TODO convert .env JWT_EXPIRY string to number to use here in maxAge
    const options = { expires: new Date(Date.now() + (24 * 3600 * 1000))}
    //set the cookie on the response
    res.cookie("auth", token, options);
    res.status(200).send(toResponse("login success"));
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});