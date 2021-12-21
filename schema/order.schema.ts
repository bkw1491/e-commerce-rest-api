import { number, object } from 'zod'
import { OrderModel } from '@models/order.model'
import { UserModel } from '@models/user.model'


const order = object({

  id: number().refine(async id => await OrderModel.findOne(id)),
  user_id: number().refine(async user_id => await UserModel.findOneById(user_id)),
  total_cost: number()
});


export const OrderSchema = {

  getOne: order.pick({id: true}),
  getMany: order.pick({user_id: true}),
  create: order.omit({id: true}),
  update: order,
  delete: order.pick({id: true})
}