import { CategoryModel } from '@models/category.model';
import { ProductModel } from '@models/product.model';
import { number, object, optional, string } from 'zod';

export interface IProduct {
  id: number,
  category_id: number,
  inventory_id: number,
  name: string,
  descr: string,
  price: number,
  image_url: string
}

const product = object({

  id: 
    number().
    refine(async id => await ProductModel.findOne(id), 
      {message: "product does not exist"}),
  category_id: 
    number().
    refine(async id => await CategoryModel.findOne(id), 
      {message: "category does not exist"}),
  inventory_id:
    number(),
  name: 
    string().
    max(255),
  descr: 
    string().
    max(255),
  price: 
    number(),
  image_url: 
    optional(
      string().
      url())
})

export const ProductSchema = {

  update: product.omit({inventory_id: true}),

  get: object({
    id: string().refine(value => !isNaN(Number(value)))
  }),
  
  create: product.omit({id: true, inventory_id: true}),
  delete: product.pick({id: true})
}




