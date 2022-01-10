export function toResponse<T>(res: T, error = false) {

  return {
    sent: new Date(),
    res,
    error
  }
}