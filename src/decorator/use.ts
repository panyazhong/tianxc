import 'reflect-metadata';
import {} from 'koa';

export function use(middleware: any) {
  return function (target: any, key: string) {
    const middlewares =
      Reflect.getMetadata('middlewares', target.prototype, key) || [];
    middlewares.push(middleware);
    Reflect.defineMetadata('middlewares', middlewares, target, key);
  };
}
