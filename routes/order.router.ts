import express from 'express';

import { Request, Response, NextFunction } from 'express';
import { OrderModel } from '@models/order.model';
import { verifyJWT } from '@middlewares/verify';
import { validateBody } from '@middlewares/validate';
import { OrderSchema } from '@schemas/order.schema';


const orderRouter = express.Router();


orderRouter.get("/", verifyJWT("admin"), validateBody(OrderSchema.getOne), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.findOne(req.body);

    res.status(200).send(order);

  } 
  
  catch (err) {
    
    next(err);
  }
});


orderRouter.get("/myorders", verifyJWT("user"), validateBody(OrderSchema.getMany), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.findMany(req.body);

    res.status(200).send(order);
  } 
  
  catch (err) {
    
    next(err);
  }
});

//endpoint should be called by stripe webhook
//need to make sure this can only be called by webhook
orderRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.createOrder(req.body);

    res.status(200).send(order);
  } 
  
  catch (err) {
    
    next(err);
  }
});


orderRouter.put("/", verifyJWT("admin"), validateBody(OrderSchema.update),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.updateOne(req.body);

    res.status(200).send(order);
  } 
  
  catch (err) {
    
    next(err);
  }
});


orderRouter.delete("/", verifyJWT("admin"), validateBody(OrderSchema.delete),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.deleteOne(req.body);

    res.status(200).send(order);
  } 
  
  catch (err) {
    
    next(err);
  }
});