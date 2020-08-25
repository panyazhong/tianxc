import { ConfigSchema } from './dev'

export interface ProdConfigScheme extends ConfigSchema {
  logRoot: string
}

const prodConfig: ProdConfigScheme = {
  port: 3000,
  mongodb: {
    host: '29.235.99.198',
    port: 27017,
    db: 'tianxc',
  },
  upload_img_size: 5 * 1024 * 1024,
  logRoot: '../../logs',
}

export default prodConfig
