import wageModel from '../database/models/wageModel';
import userModel from '../database/models/userModel';

import { get, controller, use, post } from '../../decorator/index';
import checkToken from '../../utils/checkToken';
import generatorRes from '../../utils/generatorRes';
import parseExcel from '../../utils/parseExcel';
import { Code } from './config';

@controller('/api/wage')
class Wage {
  constructor() {}

  @get('/getWage')
  @use(checkToken)
  async getWage(ctx: any) {
    const { account } = ctx.request.next;
    const { time } = ctx.request.query;
    const user: any = await userModel.findOne({
      account,
    });
    const { channelCode } = user;

    let query;
    if (account === 'admin') {
      query = {
        $match: {},
      };
    } else if (time) {
      const reg = new RegExp(time, 'i');
      query = {
        $match: {
          channelCode,
          wageMonth: {
            $regex: reg,
          },
        },
      };
    } else {
      query = {
        $match: {
          channelCode,
        },
      };
    }

    const res = await wageModel.aggregate([
      query,
      {
        $lookup: {
          from: 'users',
          localField: 'channelCode',
          foreignField: 'channelCode',
          as: 'userInfo',
        },
      },
      {
        $project: {
          _id: 1,
          wage: 1,
          channelCode: 1,
          title: 1,
          wageMonth: 1,
          'userInfo.username': 1,
        },
      },
    ]);
    console.log(res);
    ctx.response.body = generatorRes(Code.success, undefined, res);
  }

  @post('/batchAddWage')
  async batchAddWage(ctx: any) {
    try {
      const { file } = ctx.request.files;
      const { time } = ctx.request.body;
      const worksheet = parseExcel(file);

      let data: any[] = worksheet[0].data;
      const title = data[0];

      data = data.splice(1);

      const insertData = data.map((item) => {
        const channelCode = item[0],
          wage = item.splice(1);

        return {
          title,
          channelCode,
          wage,
          wageMonth: time,
        };
      });

      await wageModel.insertMany(insertData);

      ctx.response.body = generatorRes(Code.success);
    } catch (error) {}
  }
}

export default Wage;
