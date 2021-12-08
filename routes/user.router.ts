import express from 'express';
import validate from '@middlewares/validate';

import { Request, Response, NextFunction} from 'express';
import { authSchema, registerSchema } from '@models/user.model';
import { createOne } from '@controllers/user.controller';
import { issue } from '@utils/token';

//intialize user router
export const userRouter = express.Router();


userRouter.post("/register", validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from user.controller
    await createOne(req.body);
    //send the response
    res.sendStatus(200);
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});


userRouter.post("/auth", validate(authSchema), async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from user.controller
    const token = issue(req.body)
    //send the token in the response
    res.status(200).send(token);
  }

  catch(err: unknown) {
    //pass to error handling middleware
    next(err)
  }
});