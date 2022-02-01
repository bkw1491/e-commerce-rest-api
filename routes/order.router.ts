import express from 'express';
import log from '@utils/logger';

import { Request, Response, NextFunction } from 'express';
import { OrderModel } from '@models/order.model';
import { verifyJWT, verifyWebhook } from '@middlewares/verify';
import { validate } from '@middlewares/validate';
import { OrderSchema } from '@schemas/order.schema';;
import { CartModel } from '@models/cart.model';
import { toResponse } from '@utils/response';
import { InventoryModel } from '@models/inventory.model';


export const orderRouter = express.Router();


orderRouter.get("/", verifyJWT("admin"), validate(OrderSchema.getOne, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const order = await OrderModel.findOne(req.body.id);

    res.status(200).send(toResponse(order));
  } 
  
  catch (err) {
    
    next(err);
  }
});


orderRouter.get("/myorders", verifyJWT("user"), validate(OrderSchema.getMany, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const orders = await OrderModel.findMany(req.body.user_id);

    res.status(200).send(toResponse(orders));
  } 
  
  catch (err) {
    
    next(err);
  }
});


orderRouter.post("/webhook", 
  express.raw({type: 'application/json'}), verifyWebhook(), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { type } = req.body;
    //use payment_intent as the order_id
    const { payment_intent: order_id, client_reference_id}
       = req.body.data.object
    //cast client reference id to a number
    const user_id = Number(client_reference_id);
    //check event is payment success event
    if(type === "checkout.session.completed") {
      //log for reference and debugging
      log(`User ${user_id} Payment Intent Succeeded`);
      //execute non-dependent tasks concurrently
      await Promise.all([
        //update order status to success
        OrderModel.updateOne({id: order_id, status: "SUCCESS"}),
        //update the product inventory
        InventoryModel.updateMany(user_id),
        //add items to order items
        OrderModel.createItems({id: order_id, user_id,})
      ]);
      //remove items from cart
      await CartModel.deleteMany(user_id);
    }

    res.status(200).send(toResponse("webhook handled"));
  }
  
  catch (err) {

    next(err);
  }
})