import { Md5 } from 'ts-md5/dist/md5';

import { post, controller, get, del, put, use } from '../../decorator';
import { Code } from './config';
import userModel from '../database/models/userModel';
import generatorRes from '../../utils/generatorRes';
import { generatorToken } from '../../utils/generatorToken';
import checkToken from '../../utils/checkToken';
import yellowCardModel from '../database/models/yellowCardModel';
import roleModel from '../database/models/roleModel';

@controller('/api/user')
class User {
  constructor() {}

  @post('/login')
  async Login(ctx: any) {
    let { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.response.body = generatorRes(Code.error, '请填写用户名或密码');
    }
    password = Md5.hashStr(password);
    try {
      const res: any = await userModel
        .findOne(
          {
            username,
            password,
          },
          {
            username: 1,
          }
        )
        .populate('role', {
          role_name: 1,
        });

      if (res && res._id) {
        const payload = {
          _id: res._id,
          username: res.username,
          role: res.role,
        };
        const token = generatorToken(payload);

        const { username, role, _id } = res;

        const result = {
          _id,
          username,
          role,
          token,
        };

        ctx.response.body = generatorRes(Code.success, '登录成功', result);
      } else {
        console.log(res);
        ctx.response.body = generatorRes(Code.error, '用户名密码错误');
      }
    } catch (error) {}
  }

  @post('/register')
  async Register(ctx: any) {
    let { username, password, role, realname } = ctx.request.body;

    password = Md5.hashStr(password);

    try {
      const res = await userModel.create({
        username,
        realname,
        password,
        role,
      });

      // const yellowRes = await yellowCardModel.create({
      //   user: realname,
      //   yellowCard: 0,
      // })

      if (res._id) {
        ctx.response.body = generatorRes(Code.success, '注册成功');
      }
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @get('/getUsers')
  @use(checkToken)
  async GetUsers(ctx: any) {
    const { username } = ctx.request.query;
    try {
      let res;
      if (username) {
        const reg = new RegExp(username, 'g');
        res = await userModel
          .find(
            { $or: [{ username: reg }] },
            { _id: 1, username: 1, created: 1, realname: 1 }
          )
          .populate('role', { role_name: 1 });
      } else {
        res = await userModel
          .find({}, { _id: 1, username: 1, created: 1, realname: 1 })
          .populate('role', { role_name: 1 });
      }
      ctx.response.body = generatorRes(Code.success, '查询成功', res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @del('/editUser')
  @use(checkToken)
  async DelUser(ctx: any) {
    const { user_id } = ctx.request.query;
    try {
      const res = await userModel.deleteOne({
        _id: user_id,
      });

      const { deletedCount, n } = res;

      if (deletedCount === 1) {
        ctx.response.body = generatorRes(Code.success, '删除成功');
      }

      if (n === 0 || deletedCount === 0) {
        ctx.response.body = generatorRes(Code.error, '删除失败');
      }
    } catch (error) {}
  }

  @put('/editUser')
  @use(checkToken)
  async editUser(ctx: any) {
    const { user_id, role, username } = ctx.request.body;

    try {
      const res = await userModel.findByIdAndUpdate(user_id, {
        role,
        username,
      });
      ctx.response.body = generatorRes(Code.success, '编辑成功');
    } catch (error) {}
  }

  @get('/getUserInfo')
  @use(checkToken)
  async getUserInfo(ctx: any) {
    try {
      const { user_id } = ctx.request.next;
      const res = await userModel
        .findOne(
          {
            _id: user_id,
          },
          {
            username: 1,
            realname: 1,
            created: 1,
          }
        )
        .populate('role', {
          role_name: 1,
        });

      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @post('/changePwd')
  @use(checkToken)
  async changePwd(ctx: any) {
    try {
      const { user_id } = ctx.request.next;
      let { password, originPwd } = ctx.request.body;

      password = Md5.hashStr(password);
      originPwd = Md5.hashStr(originPwd);
      const res = await userModel.findOneAndUpdate(
        {
          _id: user_id,
          password: originPwd,
        },
        {
          $set: {
            password,
          },
        }
      );
      console.log(res);
      if (!res) {
        ctx.response.body = generatorRes(Code.error, '密码不正确');
      } else {
        ctx.response.body = generatorRes(Code.success);
      }
    } catch (error) {
      console.log(error);
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}
