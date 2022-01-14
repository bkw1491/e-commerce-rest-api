import { object, string, number } from 'zod';
import { CategoryModel } from '@models/category.model';


const category = object({

  id: 
    number().
    refine(async id => await CategoryModel.findOne(id), 
      {message: "category does not exist"}),
  name: 
    string().
    max(255)
})

export const CategorySchema = {

  get: category.pick({id: true}),
  create: category.pick({name: true}),
  update: category.pick({id: true, name: true}),
  delete: category.pick({id: true})
}