import { IProduct } from "@interfaces/IProduct";

export interface IOrderItem extends Pick<IProduct, "name" | "descr" | "price"> {
  id: number,
  order_id: string
  product_id: number,
  quantity: number,
}