export interface ConfigSchema {
  port: number;
  mongodb: {
    host: string;
    port: number;
    db: string;
  };
  upload_img_size: number;
}

const devConfig: ConfigSchema = {
  port: 3000,
  mongodb: {
    host: '127.0.0.1',
    port: 27017,
    db: 'tianxc',
  },
  upload_img_size: 5 * 1024 * 1024,
};

export default devConfig;
