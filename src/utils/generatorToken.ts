import jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { tokenConfig } from './config';

export interface payloadInterface {
  username: string;
  role: {
    _id: string;
    role_name: string;
  };
  _id: string;
}

export function generatorToken(payload: payloadInterface) {
  const { secret, expiresIn } = tokenConfig;

  try {
    const token = jwt.sign({ ...payload }, secret, { expiresIn });

    return `bearer ${token}`;
  } catch (error) {
    console.log(error);
  }
}
