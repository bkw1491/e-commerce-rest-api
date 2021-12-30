import express from 'express';
import log from '@utils/logger';

import { Request, Response } from 'express';
import { userRouter } from '@routes/user.router';
import { productRouter } from '@routes/product.router';
import { categoryRouter } from '@routes/category.router';
import { cartRouter } from '@routes/cart.router';
import { orderRouter } from '@routes/order.router';

//initlaize express
const app = express();

//parse incoming requests to json
//ignores requests that don't have content-type header of 'json'
app.use(express.json());

//register routes
app.use("/", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

//basic health check route to check status of api
app.get("/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});

//listen on port defined in .env file
app.listen(process.env.PORT, () => {
  log(`Listening On Port ${process.env.PORT}`)
});