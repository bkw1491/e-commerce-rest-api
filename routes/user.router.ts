import express from 'express';
import { validateBody } from '@middlewares/validate';

import { Request, Response, NextFunction} from 'express';
import { UserSchema } from '@schemas/user.schema';
import { UserModel } from '@models/user.model';
import { issue } from '@utils/token';

//intialize user router
export const userRouter = express.Router();


userRouter.post("/register", validateBody(UserSchema.register), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from user model
    await UserModel.createOne(req.body);
    //send the response
    res.sendStatus(200);
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});


userRouter.post("/auth", validateBody(UserSchema.auth), 
  async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from user model
    const token = issue(req.body)
    //send the token in the response
    res.status(200).send(token);
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});