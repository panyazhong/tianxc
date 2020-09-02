import yellowCardModel from '../database/models/yellowCardModel';

import { get, controller, use } from '../../decorator/index';
import checkToken from '../../utils/checkToken';
import generatorRes from '../../utils/generatorRes';
import { Code } from './config';

@controller('/api/yellowcard')
class YellowCard {
  constructor() {}

  @get('/getyellowCardList')
  @use(checkToken)
  async getyellowCardList(ctx: any) {
    try {
      const res = await yellowCardModel.find({});

      ctx.response.body = generatorRes(Code.success, undefined, res);
    } catch (error) {
      ctx.response.body = generatorRes(Code.error, error);
    }
  }
}

export default YellowCard;
