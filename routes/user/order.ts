import express from 'express';

import { Request, Response } from 'express';
import { OrderModel } from '@models/Order';
import { verifyJWT } from '@middlewares/verify';
import { validate } from '@middlewares/validate';
import { OrderSchema } from '@schemas/order';;
import { toResponse } from '@utils/response';


export const orderRouter = express.Router();


//get orders associated with a user
orderRouter.get(
  "/myorders", 
  verifyJWT("user"), 
  validate(OrderSchema.getMany, "body"), 
  async (req: Request, res: Response) => {

    const orders = await OrderModel.findMany(req.body.user_id);

    res.status(200).send(toResponse(orders));
  });