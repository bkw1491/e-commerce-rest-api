import { object, string, number } from 'zod';
import { CategoryModel } from '@models/category.model';


const category = object({

  id: 
    number().
    refine(async id => await CategoryModel.findOneById(id), 
      {message: "category id does not exist"}),
  name: 
    string().
    max(255),
  descr:
    string().
    max(255)
})

export const CategorySchema = {

  get: category.pick({name: true}).refine(async input => 
      await CategoryModel.findOneByName(input.name.toLowerCase()),
      { message: "category does not exist" }),

  create: category.omit({id: true}).refine(async input => 
    !await CategoryModel.findOneByName(input.name.toLowerCase()),
    { message: "category name already exists" }),
    
  update: category,
  delete: category.pick({id: true})
}