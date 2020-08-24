import Koa from 'koa'
import Router from 'koa-router'

import config from './config'

const app = new Koa()
const router = new Router()

app.use(router.routes())
router.get('/', async (ctx: any) => {
  ctx.body = 'hello world'
})

//设置监听端口
app.listen(3000, () => {
  console.log('服务器开启 127.0.0.1:3000')
})
