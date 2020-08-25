import uploadModel from '../database/models/uploadModel'
import { post, controller, use } from '../../decorator'

function check() {
  console.log('chekc')
}

@controller('/api/upload')
class Upload {
  constructor() {}

  @post('/uploadExcel')
  @use(check)
  uploadExcel(ctx: any) {
    console.log('ctx:', ctx)
    ctx.response.body = 'hello world'
  }
}
