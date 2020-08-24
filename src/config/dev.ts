import { ConfigSchema } from './index'

const devConfig: ConfigSchema = {
  port: 3000,
  mongodb: {
    host: '',
    port: 27017,
    db: 'localhost',
  },
}

export default devConfig
