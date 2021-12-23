import { IProduct } from "@interfaces/IProduct";

export interface ICartItem extends Pick<IProduct, "name" | "descr" | "price"> {
  id: number,
  userId: number
  productId: number,
  qty: number,
}