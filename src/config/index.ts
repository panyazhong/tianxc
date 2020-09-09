import devConfig from './dev';
import prodConfig from './prod';

const config = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;

export default config;
