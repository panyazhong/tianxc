import 'reflect-metadata';
import { Methods } from './controller';

export function getRequestDecorator(method: Methods) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', method, target, key);
    };
  };
}

export const post = getRequestDecorator(Methods.post);
export const get = getRequestDecorator(Methods.get);
export const put = getRequestDecorator(Methods.put);
export const del = getRequestDecorator(Methods.delete);
