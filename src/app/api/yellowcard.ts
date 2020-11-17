import yellowCardModel from '../database/models/yellowCardModel';

import { get, controller, use, post } from '../../decorator/index';
import checkToken from '../../utils/checkToken';
import generatorRes from '../../utils/generatorRes';
import { uploadFile } from '../../utils/uploadFile.js';
import { upyunConfig } from '../../utils/config';
import { Code } from './config';

interface uploadInterface {
  status: any;
  path: string;
}

@controller('/api/yellowcard')
class YellowCard {
  constructor() {}

  @get('/getyellowCardList')
  @use(checkToken)
  async getyellowCardList(ctx: any) {
    try {
      const res = await yellowCardModel
        .find({})
        .populate('uploador', { account: 1, username: 1 });

      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }

  @post('/uploadCard')
  @use(checkToken)
  async uploadCard(ctx: any) {
    const { file } = ctx.request.files,
      { year } = ctx.request.body;

    try {
      const uploadRes = await uploadFile(file),
        { status, path } = uploadRes as uploadInterface,
        { user_id } = ctx.request.next,
        upload_time = new Date().getTime();

      if (status) {
        const res = await yellowCardModel.update(
          {
            year,
          },
          {
            uploador: user_id,
            year,
            upload_time,
            url: `${upyunConfig.domain}/${path}`,
          },
          {
            upsert: true,
          }
        );
        ctx.response.body = generatorRes(Code.success, '上传成功');
      } else {
        ctx.response.body = generatorRes(Code.error, '上传失败');
      }
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, '上传失败', error);
    }
  }
}

export default YellowCard;
