export interface IOrder {
  id: string,
  user_id: number,
  total_cost: number,
  placed_date: Date
  status: "PENDING" | "SUCCESS"
}