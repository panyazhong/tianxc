import generatorRes from '../utils/generatorRes'
import { Code } from '../app/api/config'
import { tokenConfig } from './config'
import jwt from 'jsonwebtoken'
export default function checkToken(ctx: any, next: any) {
  const { authorization } = ctx.request.header
  if (!authorization) {
    ctx.response.body = generatorRes(Code.token_error, '请先登录')
  } else {
    const token = authorization.split(' ')[1]

    try {
      jwt.verify(token, tokenConfig.secret, {
        complete: true,
      })

      next()
    } catch (error) {
      ctx.response.body = generatorRes(Code.token_timeout, '请登录')
    }
  }
}
