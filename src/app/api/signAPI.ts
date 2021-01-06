import signModel from '../database/models/signModel';
import { uploadFile } from '../../utils/uploadFile.js';
import { post, controller, use, get, del } from '../../decorator';
import { upyunConfig } from '../../utils/config';
import { Code } from './config';
import generatorRes from '../../utils/generatorRes';
import checkToken from '../../utils/checkToken';

interface uploadInteface {
  status: any;
  path: string;
}

@controller('/api/sign')
class Sign {
  constructor() {}

  @post('/uploadSign')
  @use(checkToken)
  async UploadSign(ctx: any) {
    const { file } = ctx.request.files,
      sign_name = file.name.split('.')[0];

    const res = await uploadFile(file),
      { status, path } = res as uploadInteface;

    if (status) {
      try {
        const res: any = await signModel.create({
          sign_name,
          sign_url: `${upyunConfig.domain}/${path}`,
        });

        if (res && res._id) {
          ctx.response.body = generatorRes(Code.success, '上传成功');
        }
      } catch (error) {
        ctx.response.body = generatorRes(Code.error, error);
      }
    }
  }

  @get('/getSignList')
  @use(checkToken)
  async getSignList(ctx: any) {
    try {
      const { sign_name } = ctx.request.query;
      let res;
      if (sign_name) {
        const reg = new RegExp(sign_name, 'i');
        res = await signModel.find({
          $or: [
            {
              sign_name: {
                $regex: reg,
              },
            },
          ],
        });
      } else {
        res = await signModel.find({});
      }

      ctx.response.body = generatorRes(Code.success, '', res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @get('/findSignByName')
  @use(checkToken)
  async findSignByName(ctx: any) {
    const { name } = ctx.request.query;

    if (name) {
      try {
        const res = await signModel.findOne({
          name,
        });

        ctx.response.body = generatorRes(Code.success, '', res);
      } catch (error) {
        ctx.response.body = generatorRes(Code.error, error);
      }
    }
  }

  @del('/deleteSignById')
  @use(checkToken)
  async deleteSignById(ctx: any) {
    const { sign_id } = ctx.request.query;

    try {
      const res = await signModel.deleteOne({
        sign_id,
      });

      ctx.response.body = generatorRes(Code.success, '删除成功');
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}

export default Sign;
