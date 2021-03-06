import { object, string, number, optional } from 'zod';
import { CategoryModel } from '@models/Category';


const category = object({

  id: 
    number().
    refine(async id => await CategoryModel.findOneById(id), 
      {message: "category id does not exist"}),
  name: 
    string().
    max(255),
  descr:
    optional(
    string().
    max(255))
})

export const CategorySchema = {

  create: category.omit({id: true}).refine(async input => 
    !await CategoryModel.findOneByName(input.name),
    { message: "category name already exists" }),
    
  update: category,
  delete: category.pick({id: true})
}