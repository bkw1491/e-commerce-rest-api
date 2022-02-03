import express from 'express';
import log from '@utils/logger';

import { Request, Response } from 'express';
import { OrderModel } from '@models/Order';
import { verifyWebhook } from '@middlewares/verify';
import { CartModel } from '@models/Cart';
import { toResponse } from '@utils/response';
import { InventoryModel } from '@models/Inventory';
import { asyncHandler } from '@middlewares/async';


export const webhookRouter = express.Router();


//listen for the stripe webhook when user completes payment
webhookRouter.post(
  "/", 
  express.raw({type: 'application/json'}), 
  verifyWebhook(), 
  asyncHandler(async (req: Request, res: Response) => {

    //use payment_intent as the order_id
    const { payment_intent: order_id, client_reference_id}
       = req.body.data.object
    //cast client reference id to a number
    const user_id = Number(client_reference_id);
    //check event is payment success event
    if(req.body.type === "checkout.session.completed") {
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
}));