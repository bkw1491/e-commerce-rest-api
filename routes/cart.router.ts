import express from 'express';
import { validateBody } from '@middlewares/validate';

import { Request, Response, NextFunction } from 'express';
import { CartSchema } from '@schemas/cart.schema';
import { CartModel } from '@models/cart.model';
import { verifyJWT } from '@middlewares/verify';


export const cartRouter = express.Router();

cartRouter.get("/", verifyJWT, validateBody(CartSchema.get),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from cart model
    const cart = await CartModel.getItems(req.body);
    //send cart back to the user
    res.status(200).send(cart)
  } 

  catch (err) {
    
    next(err);
  }
})


cartRouter.post("/", verifyJWT, validateBody(CartSchema.create),
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


cartRouter.put("/", verifyJWT, validateBody(CartSchema.update),
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


cartRouter.delete("/", verifyJWT, validateBody(CartSchema.delete),
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