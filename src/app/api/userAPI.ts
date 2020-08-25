import { Md5 } from 'ts-md5/dist/md5';
import { post, controller, get, del, put } from '../../decorator';
import { Code } from './config';
import userModel from '../database/models/userModel';
import generatorRes from '../../utils/generatorRes';

@controller('/api/user')
class User {
  constructor() {}

  @post('/login')
  Login(ctx: any) {
    const { username, password } = ctx.request.body;

    console.log(username, password);
  }

  @post('/register')
  async Register(ctx: any) {
    let { username, password, role } = ctx.request.body;

    password = Md5.hashStr(password);

    try {
      const res = await userModel.create({
        username,
        password,
        role,
      });

      if (res._id) {
        ctx.response.body = generatorRes(Code.success, '注册成功');
      }
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @get('/getUsers')
  async GetUsers(ctx: any) {
    try {
      const res = await userModel
        .find({}, { _id: 1, username: 1 })
        .populate('role', { role_name: 1 });

      ctx.response.body = generatorRes(Code.success, '查询成功', res);
    } catch (error) {}
  }

  @del('/editUser')
  async DelUser(ctx: any) {
    // c
    console.log(ctx.request.query.id);
  }

  @put('/editUser')
  async editUser(ctx: any) {
    console.log(ctx.request.body);
  }
}
