import { IProduct } from "@interfaces/IProduct";

export interface ICartItem extends Pick<IProduct, "name" | "descr" | "price"> {
  id: number,
  user_id: number
  product_id: number,
  quantity: number,
}