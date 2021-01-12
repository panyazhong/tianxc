import behaviorModel from '../database/models/behaviorModel';
import { post, get, controller, use } from '../../decorator';
import generatorRes from '../../utils/generatorRes';
import { Code } from './config';
import jwt from 'jsonwebtoken';
import { tokenConfig } from '../../utils/config';

@controller('/api/behavior')
class Role {
  constructor() {}

  @post('/send')
  async Send(ctx: any) {
    const { token, load_time, leave_time, behavior, type } = ctx.request.body;

    const _id = checkToken(token, ctx);
    if (!_id) return;

    try {
      const res = await behaviorModel.create({
        user: _id,
        load_time,
        leave_time,
        type,
        behavior,
      });

      if (res && res._id) {
        ctx.response.body = generatorRes(Code.success, '');
      } else {
        ctx.response.body = generatorRes(Code.error);
      }
    } catch (error) {}
  }
}

let checkToken = (authorization: string, ctx: any) => {
  if (!authorization) {
    ctx.response.body = generatorRes(Code.token_error, '未携带token，请先登录');
  } else {
    const scheme = authorization.split(' ')[0];
    let token = authorization.split(' ')[1];
    if (/^bearer/i.test(scheme)) {
      try {
        const sign: any = jwt.verify(token, tokenConfig.secret, {
          complete: true,
        });

        const { _id } = sign.payload;

        return _id;
      } catch (error) {
        ctx.response.body = generatorRes(
          Code.token_error,
          'token过期，请先登录!'
        );
      }
    } else {
      ctx.response.body = generatorRes(Code.token_error, 'token异常，请先登录');
    }
  }
};
