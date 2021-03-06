import generatorRes from '../utils/generatorRes';
import { Code } from '../app/api/config';
import { tokenConfig } from './config';
import jwt from 'jsonwebtoken';
export default async function checkToken(ctx: any, next: any) {
  const { authorization } = ctx.request.header;
  if (!authorization) {
    ctx.response.body = generatorRes(Code.token_error, '未携带token，请先登录');
  } else {
    const scheme = authorization.split(' ')[0];
    const token = authorization.split(' ')[1];
    if (/^bearer/i.test(scheme)) {
      try {
        const sign: any = jwt.verify(token, tokenConfig.secret, {
          complete: true,
        });

        const { _id, account } = sign.payload;

        ctx.request.next = {
          user_id: _id,
          account,
        };

        await next();
      } catch (error) {
        console.log(error);
        ctx.response.body = generatorRes(
          Code.token_error,
          'token过期，请先登录!'
        );
      }
    } else {
      ctx.response.body = generatorRes(Code.token_error, 'token异常，请先登录');
    }
  }
}
