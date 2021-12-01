import express from 'express';

import { Request, Response, NextFunction} from 'express';
import { createOne, authOne } from '@controllers/user.controller';

//intialize user router
export const userRouter = express.Router();

//register a new user
userRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {

  try {

    //call method from user.controller
    await createOne(req.body);
    //send the response
    res.sendStatus(200);
  }

  catch(err: unknown) {

    next(err)
  }
});


//authenticate an existing user
userRouter.post("/auth", async (req: Request, res: Response, next: NextFunction) => {
  
  try {

    //call method from user.controller
    await authOne(req.body);
    //send the response
    res.sendStatus(200);
  }

  catch(err: unknown) {

    next(err)
  }
});

//logout a user
userRouter.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  
  try {

    //call method from user.controller
    //send the response
    res.sendStatus(200);
  }

  catch(err: unknown) {

    next(err)
  }
});