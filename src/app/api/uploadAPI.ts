import uploadModel from '../database/models/uploadModel';
import uploadFile from '../../utils/uploadFile.js';
import { post, controller, use, get } from '../../decorator';
import { upyunConfig } from '../../utils/config';
import { Code } from './config';
import generatorRes from '../../utils/generatorRes';
import checkToken from '../../utils/checkToken';
import yellowCardModel from '../database/models/yellowCardModel';

interface uploadInteface {
  status: any;
  path: string;
}

const getYellowCardUser = (content: string) => {
  let arr_content = JSON.parse(content).map((item: any) => item['姓名']);

  return arr_content.slice(-3);
};

const updateYellow = (user: String) => {
  return new Promise((resolve: any, reject: any) => {
    yellowCardModel
      .update(
        {
          user: user,
        },
        {
          $inc: {
            yellowCard: 1,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

@controller('/api/upload')
class Upload {
  constructor() {}

  @post('/uploadExcel')
  @use(checkToken)
  async uploadExcel(ctx: any) {
    let _this = this;
    const { file } = ctx.request.files,
      { upload_excel_titles, upload_excel_content } = ctx.request.body,
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
        upload_excel_titles,
        upload_excel_content,
      });

      const yellowCardUser = getYellowCardUser(upload_excel_content);

      const yellowCardUserPromise = yellowCardUser.map((user: String) => {
        updateYellow(user);
      });
      const setYellow = await Promise.all(yellowCardUserPromise);

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
      const res = await uploadModel
        .find(
          {},
          {
            upload_excel_titles: 0,
            upload_excel_content: 0,
          }
        )
        .populate('upload_user', {
          username: 1,
        });

      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {}
  }

  @get('/getExcelContent')
  async getExcelContent(ctx: any) {
    const { _id } = ctx.request.query;

    try {
      const content = await uploadModel.findById(_id, {
        upload_name: 1,
        upload_excel_titles: 1,
        upload_excel_content: 1,
      });

      ctx.response.body = generatorRes(Code.success, undefined, content);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}
