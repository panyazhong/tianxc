const upyun = require('upyun');
import fs from 'fs';
import { upyunConfig } from './config';

const { server_name, operator_name, operator_pwd } = upyunConfig;
const service = new upyun.Service(server_name, operator_name, operator_pwd);
const client = new upyun.Client(service);

function generatorPath(file: any): string {
  const { name } = file,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    fileDir = `${upyunConfig.rootDir}/${year}-${month}-${day}`,
    fileName = `${name.split('.')[0]}_${new Date().getTime()}.${
      name.split('.')[1]
    }`;

  return `${fileDir}/${fileName}`;
}

function generatorOps(type: string): any {
  return type.search('image') > -1 ? { 'x-gmkerl-thumb': '/format/png' } : {};
}

export function uploadFile(file: any) {
  return new Promise((resolve, reject) => {
    const filePath = generatorPath(file),
      { path, type } = file,
      options = generatorOps(type);
    client
      .putFile(filePath, fs.createReadStream(path), options)
      .then((res: any) => {
        resolve({
          status: res,
          path: filePath,
        });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

export function getFile() {
  return new Promise(async (resolve, reject) => {
    client
      .getFile({ path: '/file/2020-9-27/test.docx', saveStream: null })
      .then((res: any) => {
        resolve(res);
      });
  });
}
