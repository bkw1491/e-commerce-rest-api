import express from 'express';

import { Request, Response, NextFunction } from 'express';
import { validate } from '@middlewares/validate';
import { CartSchema } from '@schemas/cart.schema';
import { CartModel } from '@models/cart.model';
import { verifyJWT } from '@middlewares/verify';
import { toResponse } from '@utils/response';


export const cartRouter = express.Router();

cartRouter.get("/", verifyJWT("user"), validate(CartSchema.get, "body"),
async (req: Request, res: Response, next: NextFunction) => {
  
  try {

    const cart = await CartModel.findMany(req.body.user_id);

    res.status(200).send(toResponse(cart))
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.post("/checkout", verifyJWT("user"), validate(CartSchema.checkout, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const paymentUrl = await CartModel.checkout(req.body.cart);

      res.redirect(303, paymentUrl);
    } 
    
    catch (err: unknown) {
      
      next(err);
    }
})


cartRouter.post("/", verifyJWT("user"), validate(CartSchema.create, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const cart = await CartModel.createOne(req.body);

    res.status(200).send(toResponse(cart));
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.put("/", verifyJWT("user"), validate(CartSchema.update, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const cart = await CartModel.updateOne(req.body);

    res.status(200).send(toResponse(cart));    
  } 
  
  catch (err) {
    
    next(err);
  }
})


cartRouter.delete("/", verifyJWT("user"), validate(CartSchema.delete, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const cart = await CartModel.deleteOne(req.body.id);

    res.status(200).send(toResponse(cart));    
  } 
  
  catch (err) {
    
    next(err);
  }
})
