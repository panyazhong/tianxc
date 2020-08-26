import uploadModel from '../database/models/uploadModel'
import uploadFile from '../../utils/uploadFile.js'
import { post, controller, use } from '../../decorator'
import { upyunConfig } from '../../utils/config'
import { Code } from './config'
import generatorRes from '../../utils/generatorRes'

function check() {
  console.log('chekc')
}

interface uploadInteface {
  status: any
  path: string
}

@controller('/api/upload')
class Upload {
  constructor() {}

  @post('/uploadExcel')
  async uploadExcel(ctx: any) {
    const { file } = ctx.request.files,
      { name } = file,
      upload_name = name.split('.')[0]
    const res = await uploadFile(file),
      { status, path } = res as uploadInteface,
      upload_time = new Date().getTime()
    if (status) {
      const res = await uploadModel.create({
        upload_name,
        upload_url: `${upyunConfig.domain}/${path}`,
        upload_time,
      })

      if (res!._id) {
        ctx.response.body = generatorRes(Code.success, '上传成功')
      } else {
        ctx.response.body = generatorRes(Code.error, '上传失败')
      }
    } else {
      ctx.response.body = generatorRes(Code.error, '上传失败')
    }
  }
}
