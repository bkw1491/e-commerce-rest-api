import { object, string, number, optional } from 'zod';
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
    optional(
    string().
    max(255))
})

export const CategorySchema = {

  getOne: category.pick({name: true}).refine(async input => 
      await CategoryModel.findOneByName(input.name),
      { message: "category does not exist" }),

  getMany: object({
    name: string(),
    subname: string()
  }).refine(async input => {
      const [c1, c2] = await Promise.all([
        CategoryModel.findOneByName(input.name),
        await CategoryModel.findOneByName(input.subname)
      ])
      //both categories have to exist
      return c1 && c2;
  }, { message: "one or more categories does not exist" }),

  create: category.omit({id: true}).refine(async input => 
    !await CategoryModel.findOneByName(input.name),
    { message: "category name already exists" }),
    
  update: category,
  delete: category.pick({id: true})
}