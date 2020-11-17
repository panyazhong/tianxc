import { get, controller, post, use, del } from '../../decorator/index';
import { uploadFile } from '../../utils/uploadFile';
import materialModel from '../database/models/materialModel';
import { tokenConfig, upyunConfig } from '../../utils/config';
import generatorRes from '../../utils/generatorRes';
import { Code } from './config';
import checkToken from '../../utils/checkToken';

interface uploadInteface {
  status: any;
  path: string;
}

@controller('/api/material')
class Material {
  @post('/uploadFile')
  @use(checkToken)
  async uploadFile(ctx: any) {
    const { file } = ctx.request.files,
      { user_id } = ctx.request.next,
      { name } = file,
      upload_name = name.split('.')[0],
      upload_time = new Date().getTime();

    try {
      const res = await uploadFile(file),
        { status, path } = res as uploadInteface;

      if (status) {
        const uploadRes = await materialModel.create({
          name: upload_name,
          upload_time,
          uploador: user_id,
          path: `${upyunConfig.domain}/${path}`,
        });

        if (uploadRes._id) {
          ctx.response.body = generatorRes(Code.success, '上传成功');
        }
      } else {
        ctx.response.body = generatorRes(Code.success, '上传失败');
      }
    } catch (error) {
      console.log(error);
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @get('/getFile')
  @use(checkToken)
  async getFile(ctx: any) {
    try {
      const res = await materialModel.find({}).populate('uploador', {
        username: 1,
      });
      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @del('/deleteFile')
  @use(checkToken)
  async deleteFile(ctx: any) {
    try {
      const { _id } = ctx.request.query;
      const res = await materialModel.findByIdAndDelete({ _id });

      ctx.response.body = generatorRes(Code.success, '删除成功');
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}
