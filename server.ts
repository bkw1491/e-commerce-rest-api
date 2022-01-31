import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import log from '@utils/logger';

import { Request, Response } from 'express';
import { userRouter } from '@routes/user.router';
import { productRouter } from '@routes/product.router';
import { inventoryRouter } from '@routes/inventory.router';
import { categoryRouter } from '@routes/category.router';
import { cartRouter } from '@routes/cart.router';
import { orderRouter } from '@routes/order.router';
import { webhook } from '@middlewares/webhook';

//initlaize express
const app = express();
//attackers can use this header to detect apps running Express
app.disable('x-powered-by');
app.use(cookieParser());

//adds the Access-Control-Allow-Credentials header to req
//TODO this will change for production
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
//decides what to parse the req body to
app.use(webhook);

//register routes
app.use("/", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/inventory", inventoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

//basic health check route to check status of api
app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

//listen on port defined in .env file
app.listen(process.env.PORT, () => {
  log(`Listening On Port ${process.env.PORT}`)
});