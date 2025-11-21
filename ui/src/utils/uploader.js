import OSS from 'ali-oss'
import { getOssStsInfo } from '@/api/oss'
let ossClient
let dir
let parameter
export default {

  ossInitial() {
    return getOssStsInfo({}).then(res => {
      let config = {
        endpoint: 'oss-cn-beijing.aliyuncs.com',
        accessKeyId: res.AccessKeyId,
        accessKeySecret: res.AccessKeySecret,
        stsToken: res.SecurityToken,
        bucket:'jiaoyin-ifa'
      }

      this.ossClient = new OSS(config)
      console.log('ossConfig::', res)
      return true
    }).catch(err => {
      console.log('err::', err)
      return false
    })
  },


  uploadHandle(name,file) {
    return this.putObject(name,file.raw).then(res => {
      return this.parameter
    })
  },

  async putObject (name, file) {
    try {
      const result = await this.ossClient.put('/ifa/channel/image/'+name, file);
      this.parameter = result
    } catch (e) {
      console.log(e);
    }
  },

  authorizedAccessUrl (url) {
    console.log(url);
    return this.ossClient.signatureUrl(url)
  }
}
