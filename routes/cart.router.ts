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
    const cart = await CartModel.findItems(req.body);
    //send cart back to the user
    res.status(200).send(cart)
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.get("/checkout", verifyJWT("user"),
  async (req: Request, res: Response, next: NextFunction) => {

    try {
      //call method from cart model
      const intent = await CartModel.checkout(req.body.user_id);

      res.status(200).send(intent);
    } 
    
    catch (err: unknown) {
      
      next(err);
    }
})


cartRouter.post("/", verifyJWT("user"), validateBody(CartSchema.create),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from cart model
    const cart = await CartModel.addItem(req.body);
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
    const cart = await CartModel.updateItem(req.body);
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
    const cart = await CartModel.deleteItem(req.body);
    //send the cart back in the response
    res.status(200).send(cart);    
  } 
  
  catch (err) {
    
    next(err);
  }
})
