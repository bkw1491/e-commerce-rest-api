import express from 'express';

import { verifyJWT } from '@middlewares/verify';
import { categoryRouter } from './category';
import { inventoryRouter } from './inventory';
import { productRouter } from './product';


export const adminRouter = express.Router();

//all the routes here will require admin priv
adminRouter.use(verifyJWT("admin"));
//these middlewares are specific to admin route
//allows the many admin routes to be more organised
adminRouter.use("/category", categoryRouter);
adminRouter.use("/inventory", inventoryRouter);
adminRouter.use("/product", productRouter);