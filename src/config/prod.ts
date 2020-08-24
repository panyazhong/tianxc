import { ProdConfigScheme } from './index'

const prodConfig: ProdConfigScheme = {
  port: 3000,
  mongodb: {
    host: '',
    port: 27017,
    db: 'localhost',
  },
  logRoot: '../../logs',
}

export default prodConfig
