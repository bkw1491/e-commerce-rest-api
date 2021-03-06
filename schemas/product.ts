import { CategoryModel } from '@models/Category';
import { ProductModel } from '@models/Product';
import { array, number, object, optional, string } from 'zod';



const product = object({

  id: 
    number().
    refine(async id => await ProductModel.findOne(id), 
      {message: "product does not exist"}),
  name: 
    string().
    max(255),
  descr: 
    string().
    max(255),
  price: 
    number().
    min(0),
  department:
    string().
    max(255),
  image_url: 
    string().
    url(),
  image_alt: 
    string().
    max(255),
  categories:
    array(
      string().
      refine(async value => 
        await CategoryModel.findOneByName(value), 
        { message: "one or more categories do not exist" })
    ).max(5).min(1)
})

export const ProductSchema = {

  get: optional(object({
    name: optional(string().max(50)),
    id: optional(string().max(50).refine(id => !isNaN(Number(id))))
  })),

  create: product.omit({id: true}),
  update: product,
  delete: product.pick({id: true})
}




