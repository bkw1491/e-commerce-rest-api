import express from 'express';

import { Request, Response, NextFunction } from 'express';
import { OrderModel } from '@models/order.model';
import { verifyJWT } from '@middlewares/verify';
import { validateBody } from '@middlewares/validate';
import { OrderSchema } from '@schemas/order.schema';


export const orderRouter = express.Router();


orderRouter.get("/", verifyJWT("admin"), validateBody(OrderSchema.getOne), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.findOne(req.body.id);

    res.status(200).send(order);

  } 
  
  catch (err) {
    
    next(err);
  }
});


orderRouter.get("/myorders", verifyJWT("user"), validateBody(OrderSchema.getMany), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.findMany(req.body.user_id);

    res.status(200).send(order);
  } 
  
  catch (err) {
    
    next(err);
  }
});

//TODO webhook endpoint here when order succeeds