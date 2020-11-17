import { Md5 } from 'ts-md5/dist/md5';

import { post, controller, get, del, put, use } from '../../decorator';
import { Code } from './config';
import userModel from '../database/models/userModel';
import generatorRes from '../../utils/generatorRes';
import { generatorToken } from '../../utils/generatorToken';
import checkToken from '../../utils/checkToken';
import parseExcel from '../../utils/parseExcel';
import yellowCardModel from '../database/models/yellowCardModel';
import roleModel from '../database/models/roleModel';

@controller('/api/user')
class User {
  constructor() {}

  @post('/login')
  async Login(ctx: any) {
    let { account, password } = ctx.request.body;
    if (!account || !password) {
      ctx.response.body = generatorRes(Code.error, '请填写用户名或密码');
    }
    password = Md5.hashStr(password);
    try {
      const res: any = await userModel
        .findOne(
          {
            account,
            password,
          },
          {
            account: 1,
          }
        )
        .populate('role', {
          role_name: 1,
        });

      if (res && res._id) {
        const payload = {
          _id: res._id,
          account: res.account,
          role: res.role,
        };
        const token = generatorToken(payload);

        const { account, role, _id } = res;

        const result = {
          _id,
          account,
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
    let { account, password, role, username } = ctx.request.body;

    password = Md5.hashStr(password);

    try {
      const res = await userModel.create({
        account,
        username,
        password,
        role,
      });

      // const yellowRes = await yellowCardModel.create({
      //   user: username,
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
    const { account } = ctx.request.query;
    try {
      let res;
      if (account) {
        const reg = new RegExp(account, 'g');
        res = await userModel
          .find(
            { $or: [{ account: reg }] },
            { _id: 1, account: 1, created: 1, username: 1 }
          )
          .populate('role', { role_name: 1 });
      } else {
        res = await userModel
          .find({}, { _id: 1, account: 1, created: 1, username: 1 })
          .populate('role', { role_name: 1 });
      }
      ctx.response.body = generatorRes(Code.success, '', res);
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
    const { user_id, role, account } = ctx.request.body;

    try {
      const res = await userModel.findByIdAndUpdate(user_id, {
        role,
        account,
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
            account: 1,
            username: 1,
            district: 1,
            net: 1,
            telephone: 1,
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

  @post('/batchAddUser')
  async batchAddUser(ctx: any) {
    const { file } = ctx.request.files;
    const worksheet = parseExcel(file);
    let users = worksheet[0].data;
    users = users.splice(1);
    const insertData = users.map((user: any) => {
      const telephone = String(user[4]),
        district = user[0],
        net = user[1],
        account = user[3],
        username = user[2];
      return {
        district,
        net,
        account,
        username,
        telephone,
        password: Md5.hashStr(`${account}${telephone.slice(-4)}`),
        role: '5f44b30778d62e45b1598e08',
      };
    });

    console.log(insertData.length);
    // return;

    try {
      let res = await userModel.insertMany(insertData);
      ctx.response.body = generatorRes(Code.success, '注册成功');
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}
