import uploadModel from '../database/models/uploadModel';
import uploadFile from '../../utils/uploadFile.js';
import { post, controller, use, get } from '../../decorator';
import { upyunConfig } from '../../utils/config';
import { Code } from './config';
import generatorRes from '../../utils/generatorRes';
import checkToken from '../../utils/checkToken';
import yellowCardModel from '../database/models/yellowCardModel';
import userModel from '../database/models/userModel';

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
      {
        upload_excel_titles,
        upload_excel_content,
        ststistics_month,
      } = ctx.request.body,
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
        ststistics_month,
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
  @use(checkToken)
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
  @use(checkToken)
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

  @get('/getUserRank')
  @use(checkToken)
  async getUserRank(ctx: any) {
    try {
      const { user_id } = ctx.request.next;
      let { year } = ctx.request.query;

      year = year || new Date().getFullYear();

      const start = new Date(`${year - 1}-12-31`).getTime();
      const end = new Date(`${Number(year) + 1}-01-01`).getTime();

      const user: any = await userModel.findById(user_id, {
        realname: 1,
      });

      const { realname } = user;

      const excel = await uploadModel.find({
        ststistics_month: {
          $gte: start,
          $lt: end,
        },
      });

      const userRanks = excel.map((item: any) => {
        let content = JSON.parse(item.upload_excel_content);
        const userRank = content.filter((userItem: any) => {
          return userItem['姓名'] === realname;
        });

        return {
          rank_time: new Date(Number(item.ststistics_month)).getMonth() + 1,
          rank: userRank[0] ? userRank[0]['排名'] : 0,
        };
      });

      const MONTH_LENGTH = 12;
      let res = [];
      for (let i = 1; i <= MONTH_LENGTH; i++) {
        let filters = userRanks.filter((userRank) => userRank.rank_time === i);
        res.push(
          filters.length > 0
            ? filters[0]
            : {
                rank_time: i,
                rank: 0,
              }
        );
      }
      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}
