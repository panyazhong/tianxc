import uploadModel from '../database/models/uploadModel';
import { post, controller } from '../../decorator';

@controller('/api/upload')
class Upload {
  constructor() {}

  @post('/uploadExcel')
  uploadExcel(ctx: any) {
    console.log('ctx:', ctx);
    ctx.response.body = 'hello world';
  }
}
