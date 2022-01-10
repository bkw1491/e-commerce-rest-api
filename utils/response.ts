export function toResponse<T>(res: T, error: boolean) {

  return {
    sent: new Date(),
    res,
    error
  }
}