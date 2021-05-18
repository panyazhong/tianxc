export interface ConfigSchema {
  port: number;
  mongodb: {
    host: string;
    port: number;
    db: string;
    user: string;
    pwd: string;
  };
  upload_img_size: number;
}

const devConfig: ConfigSchema = {
  port: 3001,
  mongodb: {
    host: '127.0.0.1',
    port: 27017,
    db: 'tianxc',
    user: 'root',
    pwd: '123456',
  },
  upload_img_size: 5 * 1024 * 1024,
};

export default devConfig;
