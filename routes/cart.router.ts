import express from 'express';

import { Request, Response, NextFunction } from 'express';
import { validateBody } from '@middlewares/validate';
import { CartSchema } from '@schemas/cart.schema';
import { CartModel } from '@models/cart.model';
import { verifyJWT } from '@middlewares/verify';


export const cartRouter = express.Router();

cartRouter.get("/", verifyJWT("user"), validateBody(CartSchema.get),
async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from cart model
    const cart = await CartModel.findMany(req.body.user_id);
    //send cart back to the user
    res.status(200).send(cart)
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.post("/checkout", verifyJWT("user"),
  async (req: Request, res: Response, next: NextFunction) => {

    try {
      //call method from cart model
      const paymentUrl = await CartModel.checkout(req.body.user_id);

      res.redirect(303, paymentUrl);
    } 
    
    catch (err: unknown) {
      
      next(err);
    }
})


cartRouter.post("/", verifyJWT("user"), validateBody(CartSchema.create),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from cart model
    const cart = await CartModel.createOne(req.body);
    //send the cart back in the response
    res.status(200).send(cart);
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.put("/", verifyJWT("user"), validateBody(CartSchema.update),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    //call method from cart model
    const cart = await CartModel.updateOne(req.body);
    //send the cart back in the response
    res.status(200).send(cart);    
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.delete("/", verifyJWT("user"), validateBody(CartSchema.delete),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from cart model
    const cart = await CartModel.deleteOne(req.body.id);
    //send the cart back in the response
    res.status(200).send(cart);    
  } 
  
  catch (err) {
    
    next(err);
  }
})
