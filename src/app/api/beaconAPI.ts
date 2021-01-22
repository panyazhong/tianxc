import behaviorModel from '../database/models/behaviorModel';
import { post, get, controller, use } from '../../decorator';
import generatorRes from '../../utils/generatorRes';
import { Code } from './config';
import jwt from 'jsonwebtoken';
import { tokenConfig } from '../../utils/config';
import { ParamName } from 'koa-router';

interface resultInterface {
  [paramName: string]: any;
}

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
        start_time = new Date(date.setDate(day - 10)).getTime();
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

      // console.log(res);
      let users = <any>[];

      users = res.map((item: any) => item.user._id);

      users = Array.from(new Set(users));
      // console.log(users);

      let result: resultInterface = {};
      let modules: resultInterface = {};
      let moduleUsers: any = {};

      // 生成modules数据
      res.forEach((item: any) => {
        modules = mergeBehavior(result, JSON.parse(item.behavior));
      });
      moduleUsers = mergeUsers(modules, res);

      result = gengerateModuleResult(modules, moduleUsers);
      ctx.response.body = generatorRes(Code.success, '', result);
    } catch (error) {
      console.log('error:', error);
    }
  }

  @get('/getUserInlineTime')
  async getUserInlineTime(ctx: any) {
    let { start_time, end_time } = ctx.request.query;
    if (start_time && end_time) {
      start_time = new Date(start_time).getTime();
      end_time = new Date(end_time).getTime();
    } else {
      // 默认七天
      let date = new Date();
      let day = date.getDate();
      start_time = new Date(date.setDate(day - 10)).getTime();
      end_time = new Date().getTime();
    }

    try {
      let queryRes = await behaviorModel
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

      let userResult: any = {};

      // 统计用户数
      let users = <any>[];
      users = queryRes.map((item: any) => item.user._id);
      users = Array.from(new Set(users));

      userResult = generatorUserInlineTime(users, queryRes);

      ctx.response.body = generatorRes(Code.success, '', userResult);
    } catch (error) {}
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

let mergeUsers = (modules: any, res: any) => {
  let result: resultInterface = {};
  let finalResult: resultInterface = {};
  try {
    res.forEach((item: any) => {
      for (let key in modules) {
        if (JSON.parse(item.behavior) && !!JSON.parse(item.behavior)[key]) {
          if (!result[key]) {
            result[key] = [];
          }
          result[key].push(item.user._id);
        }
      }
    });

    for (let key in result) {
      finalResult[key] = [new Set(result[key])].length;
    }
    return finalResult;
  } catch (error) {
    console.log('user-error:', error);
  }
};

let gengerateModuleResult = (modules: any, moduleUsers: any) => {
  let result: resultInterface = {};
  for (let key in modules) {
    result[key] = {
      visitNum: modules[key],
      visitUsers: moduleUsers[key],
    };
  }

  return result;
};

let generatorUserInlineTime = (users: any[], queryRes: any) => {
  let result: resultInterface = {};

  users.forEach((user: any) => {
    queryRes.forEach((queryItem: any) => {
      if (queryItem.user._id === user) {
        if (!result[user]) {
          result[user] = {
            user_name: queryItem.user.username,
            visit_time: queryItem.leave_time - queryItem.load_time,
          };
        } else {
          let time = result[user].visit_time;
          const { load_time, leave_time } = queryItem;

          time = time + leave_time - load_time;

          result[user].visit_time = time;
        }
      }
    });
  });
  return result;
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
