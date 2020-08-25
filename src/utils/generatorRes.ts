interface Result {
  code: number
  msg?: string
  data?: any
}

export default function generatorRes(
  code: number,
  msg?: string,
  data?: any
): Result {
  return {
    code,
    msg,
    data,
  }
}
