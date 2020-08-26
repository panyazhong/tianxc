interface upyun {
  server_name: string
  operator_name: string
  operator_pwd: string
  rootDir: string
  domain: string
}

interface tokenInterface {
  secret: string
  expiresIn: string
}

export const upyunConfig: upyun = {
  server_name: 'uinout',
  operator_name: 'dapan',
  operator_pwd: '43XRsmdLiixQkNDdZ4ge8ZmrTuB1KVxU',
  rootDir: 'file',
  domain: 'tianxc.uinout.cn',
}

export const tokenConfig: tokenInterface = {
  secret: 'tianxc',
  expiresIn: '6h',
}
