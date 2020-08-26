import roleModel from '../database/models/roleModel'
import { post, get, controller, use } from '../../decorator'
import generatorRes from '../../utils/generatorRes'
import { Code } from './config'
import checkToken from '../../utils/checkToken'

@controller('/api/role')
class Role {
  constructor() {}

  @post('/createRole')
  async createRole(ctx: any) {
    const { role_name } = ctx.request.body

    if (role_name) {
      try {
        const res = await roleModel.create({
          role_name,
        })

        if (res._id) {
          ctx.response.body = generatorRes(Code.success, '新增成功')
        }
      } catch (error) {
        ctx.response.body = generatorRes(Code.error, error)
      }
    }
  }

  @get('/getRoles')
  @use(checkToken)
  async getRoles(ctx: any) {
    try {
      const res = await roleModel.find()
      ctx.response.body = generatorRes(Code.success, undefined, res)
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error)
    }
  }
}
