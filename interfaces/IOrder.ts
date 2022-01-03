export interface IOrder {
  id: number,
  user_id: number,
  total_cost: number,
  placed_date: Date
  status: "PENDING" | "FAILURE" | "COMPLETE"
}