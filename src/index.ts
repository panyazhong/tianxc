import Koa from 'koa';
import KoaBody from 'koa-body';
// import bodyParser from 'koa-bodyparser';
import router from './router';

import config from './config';
import './app/api';

const app = new Koa();

// app.use(bodyParser());
app.use(
  KoaBody({
    multipart: true, // 支持文件上传
    strict: false,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);
app.use(router.routes()).use(router.allowedMethods());

//设置监听端口
app.listen(config.port, () => {
  console.log('服务器开启 127.0.0.1:3000');
});
