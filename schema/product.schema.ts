import { CategoryModel } from '@models/category.model';
import { ProductModel } from '@models/product.model';
import { number, object, string } from 'zod';



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
  image_url: 
    string().
    url(),
  image_alt: 
    string().
    max(255)
})

export const ProductSchema = {
  
  get: object({
    //schema rejects if param is not a number
    id: string().refine(value => !isNaN(Number(value)),
    {message: "product does not exist"})
  }),
  create: product.omit({id: true}),
  update: product,
  delete: product.pick({id: true})
}




