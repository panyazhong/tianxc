import behaviorModel from '../database/models/behaviorModel';
import { post, get, controller, use } from '../../decorator';
import generatorRes from '../../utils/generatorRes';
import { Code } from './config';
import jwt from 'jsonwebtoken';
import { tokenConfig } from '../../utils/config';
import { ParamName } from 'koa-router';

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

  @get('/getModulesInfo')
  async getUserBehavior(ctx: any) {
    try {
      let { start_time, end_time } = ctx.request.query;

      if (start_time && end_time) {
        start_time = new Date(start_time).getTime();
        end_time = new Date(end_time).getTime();
      } else {
        // 默认七天
        let date = new Date();
        let day = date.getDate();
        start_time = new Date(date.setDate(day - 7)).getTime();
        end_time = new Date().getTime();
      }

      const res = await behaviorModel
        .find({
          load_time: {
            $gte: start_time,
          },
          leave_time: {
            $lte: end_time,
          },
        })
        .populate('user', {
          username: 1,
        });

      // let users = <any>[];

      // users = res.map((item: any) => item.user._id);

      // users = Array.from(new Set(users));

      interface resultInterface {
        [paramName: string]: any;
      }
      let result: resultInterface = {};
      res.forEach((item: any) => {
        // users.forEach((id: any) => {
        // if (item.user._id === id) {
        // if (result[id]) {
        // result[id] = mergeBehavior(result[id], JSON.parse(item.behavior));
        // } else {
        // result[id] = JSON.parse(item.behavior);
        // }
        // }
        result = mergeBehavior(result, JSON.parse(item.behavior));
        // });
      });

      ctx.response.body = generatorRes(Code.success, '', result);
    } catch (error) {
      console.log(error);
    }
  }
}

let mergeBehavior = (origin: any, behavior: any) => {
  try {
    for (let key in behavior) {
      if (origin[key]) {
        origin[key] += behavior[key];
      } else {
        origin[key] = behavior[key];
      }
    }

    return origin;
  } catch (error) {
    console.log(error);
  }
};

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
