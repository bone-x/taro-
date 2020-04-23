import Taro from '@tarojs/taro'
// const SSOTOKEN = Taro.getStorageSync('token')
// OSS 签名
export const ossSign = ({ key }) => {
  return Taro.request({
    url: 'http://lctestkuaijiapp.beta.hqjy.com/learningCenter/app/teachnote/getPhotoSign',
    method: 'GET',
    header: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      clientType: Taro.getEnv(),
      userToken: Taro.getStorageSync('token')
    },
    data: {
      key,
      SSOTOKEN:Taro.getStorageSync('token')
    }
  })
}

// 文件上传
export const upload = (sign = {}, file) => {
  const splitUrl = String(sign.url).split('/')
  const fileName = splitUrl[splitUrl.length - 1]
  const data = new FormData()
  data.append('key', `${sign.dir}${fileName}`)
  data.append('policy', sign.policy)
  data.append('OSSAccessKeyId', sign.accessid)
  data.append('success_action_status', 200)
  data.append('signature', sign.signature)
  data.append('callback', sign.callback)
  data.append('file', file)

  return Taro.request({
    url: sign.host,
    method: 'POST',
    data,
    header: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      clientType: Taro.getEnv(),
      userToken: Taro.getStorageSync('token')
    }
  })
}
