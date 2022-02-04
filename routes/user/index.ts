import express from 'express';

import { orderRouter } from '@routes/user/order';
import { authRouter } from '@routes/user/auth';
import { registerRouter } from '@routes/user/register';


export const userRouter = express.Router();

//these middlewares are specific to admin route
//allows user routes to be more organised
userRouter.use("/register", registerRouter);
userRouter.use("/auth", authRouter);
userRouter.use("/orders", orderRouter);