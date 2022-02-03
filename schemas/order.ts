import { date, number, string, object } from 'zod'
import { OrderModel } from '@models/Order'
import { UserModel } from '@models/User'


const order = object({

  id: string().refine(async id => await OrderModel.findOne(id)),
  user_id: number().refine(async user_id => await UserModel.findOneById(user_id)),
  total_cost: number(),
  placed_date: date()
});


export const OrderSchema = {

  getOne: order.pick({id: true}),
  getMany: order.pick({user_id: true}),
  create: order.omit({id: true}),
  update: order,
  delete: order.pick({id: true})
}