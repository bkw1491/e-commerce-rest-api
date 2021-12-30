import { IProduct } from "@interfaces/IProduct";

//TODO this is the same as ICartItem, reference that instead?
export interface IOrderItem extends Pick<IProduct, "name" | "descr" | "price"> {
  id: number,
  order_id: number
  product_id: number,
  quantity: number,
}