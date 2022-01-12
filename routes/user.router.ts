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
    //call method from util to create a json web token
    const token = issue(req.body)
    //http only prevents client-side javascript from accessing the cookie
    //no sensitive info is stored in the cookie anyway
    //TODO convert .env JWT_EXPIRY string to number to use here in maxAge
    res.cookie("auth", token, { maxAge: 14400, httpOnly: true });
    //got here so everything ok, have to send something back
    res.status(200).send(toResponse("login success"));
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});