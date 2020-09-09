import { ConfigSchema } from './dev';

export interface ProdConfigScheme extends ConfigSchema {
  logRoot: string;
}

const prodConfig: ProdConfigScheme = {
  port: 3000,
  mongodb: {
    host: '49.235.99.198',
    port: 20717,
    db: 'tianxc',
    user: 'tianxc',
    pwd: 'tianxc1993',
  },
  upload_img_size: 5 * 1024 * 1024,
  logRoot: '../../logs',
};

export default prodConfig;
