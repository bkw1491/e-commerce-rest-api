//returns a obj with res and no error
export function toResponse(data: any) {

  return {
    sent: new Date(),
    data,
    error: null
  }
}

//return obj with error and no res
export function toError(msg: string | string[]) {

  return {
    sent: new Date(),
    data: null,
    error: msg
  }
}