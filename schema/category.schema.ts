import { object, string, number } from 'zod';
import { CategoryModel } from '@models/category.model';


const category = object({

  id: 
    number().
    refine(async id => await CategoryModel.findOneById(id), 
      {message: "category does not exist"}),
  name: 
    string().
    max(255)
})

export const CategorySchema = {

  get: object({
    name: string().refine(async value => {
      //category does not exist, schema rejects
      if(!await CategoryModel.findOneByName(value)) { return false }
      //otherwise schema passed
      return true
    }, {message: "category does not exist"})
  }),
  create: category.pick({name: true}),
  update: category.pick({id: true, name: true}),
  delete: category.pick({id: true})
}