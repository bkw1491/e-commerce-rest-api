//returns a obj with res and no error
export function toResponse(res: any) {

  return {
    sent: new Date(),
    res,
    error: null
  }
}

//return obj with error and no res
export function toError(msg: string | string[]) {

  return {
    sent: new Date(),
    res: null,
    error: msg
  }
}