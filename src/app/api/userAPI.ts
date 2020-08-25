import { Md5 } from 'ts-md5/dist/md5'
import { post, controller, get, del, put } from '../../decorator'
import { Code } from './config'
import userModel from '../database/models/userModel'
import generatorRes from '../../utils/generatorRes'

@controller('/api/user')
class User {
  constructor() {}

  @post('/login')
  Login(ctx: any) {
    const { username, password } = ctx.request.body

    console.log(username, password)
  }

  @post('/register')
  async Register(ctx: any) {
    let { username, password, role } = ctx.request.body

    password = Md5.hashStr(password)

    try {
      const res = await userModel.create({
        username,
        password,
        role,
      })

      if (res._id) {
        ctx.response.body = generatorRes(Code.success, '注册成功')
      }
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error)
    }
  }

  @get('/getUsers')
  async GetUsers(ctx: any) {
    try {
      const res = await userModel
        .find({}, { _id: 1, username: 1 })
        .populate('role', { role_name: 1 })

      ctx.response.body = generatorRes(Code.success, '查询成功', res)
    } catch (error) {}
  }

  @del('/editUser')
  async DelUser(ctx: any) {
    const { user_id } = ctx.request.query
    try {
      const res = await userModel.deleteOne({
        _id: user_id,
      })

      const { deletedCount, n } = res

      if (deletedCount === 1) {
        ctx.response.body = generatorRes(Code.success, '删除成功')
      }

      if (n === 0 || deletedCount === 0) {
        ctx.response.body = generatorRes(Code.error, '删除失败')
      }
    } catch (error) {}
  }

  @put('/editUser')
  async editUser(ctx: any) {
    const { user_id, role, username } = ctx.request.body

    try {
      const res = await userModel.findByIdAndUpdate(user_id, {
        role,
        username,
      })
      ctx.response.body = generatorRes(Code.success, '编辑成功')
    } catch (error) {}
  }
}
