import express from 'express';
import cors from 'cors';
import log from '@utils/logger';

import { Request, Response } from 'express';
import { userRouter } from '@routes/user.router';
import { productRouter } from '@routes/product.router';
import { categoryRouter } from '@routes/category.router';
import { cartRouter } from '@routes/cart.router';
import { orderRouter } from '@routes/order.router';
import { webhook } from '@middlewares/webhook';

//initlaize express
const app = express();
//decices what to parse the req body to
app.use(webhook);
app.use(cors())

//register routes
app.use("/api/", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

//basic health check route to check status of api
app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

//listen on port defined in .env file
app.listen(process.env.PORT, () => {
  log(`Listening On Port ${process.env.PORT}`)
});