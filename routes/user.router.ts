import express from 'express';

import { Request, Response, NextFunction} from 'express';

//intialize user router
export const userRouter = express.Router();

//register a new user
userRouter.post("/register"), (req: Request, res: Response, next: NextFunction) => {

}


//authenticate an existing user
userRouter.post("/auth"), (req: Request, res: Response, next: NextFunction) => {
  
}

//logout a user
userRouter.post("/logout"), (req: Request, res: Response, next: NextFunction) => {
  
}