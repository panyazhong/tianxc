import devConfig from './dev'
import prodConfig from './prod'

export interface ConfigSchema {
  port: number
  mongodb: {
    host: string
    port: number
    db: string
  }
}

export interface ProdConfigScheme extends ConfigSchema {
  logRoot: string
}

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

export default config
