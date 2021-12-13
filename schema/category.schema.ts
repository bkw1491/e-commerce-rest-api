import {object, string, number } from 'zod';
import { CategoryModel } from '@models/category.model';

export interface ICategory {
  id: number,
  name: string
}

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

  get: object({
    id: string().refine(async value => {
      //if the param is not a number, schema rejects
      if(isNaN(Number(value))) { return false }
      //category does not exist, schema rejects
      if(!await CategoryModel.findOne(Number(value))) { return false }
      //otherwise schema passed
      return true
    }, {message: "category does not exist"})
  }),

  create: category.pick({name: true}),
  update: category.pick({id: true, name: true}),
  delete: category.pick({id: true})
}