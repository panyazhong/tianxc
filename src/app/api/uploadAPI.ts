import uploadModel from '../database/models/uploadModel';
import uploadFile from '../../utils/uploadFile.js';
import { post, controller, use, get } from '../../decorator';
import { upyunConfig } from '../../utils/config';
import { Code } from './config';
import generatorRes from '../../utils/generatorRes';
import checkToken from '../../utils/checkToken';

function check() {
  console.log('chekc');
}

interface uploadInteface {
  status: any;
  path: string;
}

@controller('/api/upload')
class Upload {
  constructor() {}

  @post('/uploadExcel')
  @use(checkToken)
  async uploadExcel(ctx: any) {
    const { file } = ctx.request.files,
      { user_id } = ctx.request.next,
      { name } = file,
      upload_name = name.split('.')[0];
    const res = await uploadFile(file),
      { status, path } = res as uploadInteface,
      upload_time = new Date().getTime();
    if (status) {
      const res = await uploadModel.create({
        upload_name,
        upload_url: `${upyunConfig.domain}/${path}`,
        upload_time,
        upload_user: user_id,
      });

      if (res!._id) {
        ctx.response.body = generatorRes(Code.success, '上传成功');
      } else {
        ctx.response.body = generatorRes(Code.error, '上传失败');
      }
    } else {
      ctx.response.body = generatorRes(Code.error, '上传失败');
    }
  }

  @get('/getExcelList')
  // @use(checkToken)
  async getExcelList(ctx: any) {
    const { date } = ctx.request.query;

    try {
      const res = await uploadModel.find({}).populate('upload_user', {
        username: 1,
      });

      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {}
  }
}
