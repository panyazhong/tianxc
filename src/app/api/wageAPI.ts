import wageModel from '../database/models/wageModel';

import { get, controller, use, post } from '../../decorator/index';
import checkToken from '../../utils/checkToken';
import generatorRes from '../../utils/generatorRes';
import parseExcel from '../../utils/parseExcel';
import { Code } from './config';

@controller('/api/wage')
class Wage {
  constructor() {}

  @get('/getWage')
  async getWage(ctx: any) {
    const res = await wageModel.aggregate([
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
          'userInfo.username': 1,
        },
      },
    ]);
    ctx.response.body = generatorRes(Code.success, undefined, res);
  }

  @post('/batchAddWage')
  async batchAddWage(ctx: any) {
    try {
      const { file } = ctx.request.files;
      const worksheet = parseExcel(file);

      let data: any[] = worksheet[0].data;
      data = data.splice(1);

      const insertData = data.map((item) => {
        const channelCode = item[0],
          wage = item[1];

        return {
          channelCode,
          wage,
        };
      });

      await wageModel.insertMany(insertData);

      ctx.response.body = generatorRes(Code.success);
    } catch (error) {}
  }
}

export default Wage;
