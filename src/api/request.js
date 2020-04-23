import Taro from '@tarojs/taro';
import URI from 'urijs';
import apiConfig from './api.js';
import CONFIG from './api-config.js';

const needLogin_code = [1002, 401];
const alertCode = [2311, 2308];
const notAlertCode = [402];
const clientType = Taro.getEnv();

/**
 * @Description:
 * @params {string} apiName：配置的接口
 * @params {object} data:参数
 * @return: promise （response.result||response.data||'success'） 操作型判断是否等于success 其他直接返回数据
 * @LastEditors: 邓达
 * @LastEditTime: Do not edit
 * @Date: 2019-04-23 11:56:18
 */
export default function fetch(apiName, data = {}, query = {}) {
  // 声明局部公用变量
  let newConfig = {};
  let urlParams = {};
  let requestUrl = null;
  let h5RequestConfig = null;
  let method = null;
  let header = {};
  let isStrangePost = false;
  const setData = () => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      // window.location.search
      const { params } = Taro._$router;
      urlParams = params || {};
    }

    const token = urlParams.token || Taro.getStorageSync('token');
    // console.log(token, 'token')
    // const token = '8098e60e8000016ae2412cd78000000e'
    if (typeof apiConfig[apiName] !== 'object') {
      throw new Error('调用api函数函数错误，请检查函数名称是否错误' + apiName);
    }
    newConfig = JSON.parse(JSON.stringify(apiConfig[apiName]));
    isStrangePost = newConfig.isStrangePost || false;
    let { url = '', interFaceType = 'live', hasToken = false } = newConfig;
    method = newConfig.method || 'get';
    header = newConfig.header || {};
    if (token != '') {
      header['token'] = token;
    }

    header['clientType'] = clientType;
    if (!apiConfig[apiName].noCookie) {
      header.cookie = Taro.getStorageSync('sessionid');
    }
    if (data) {
      url = url.replace(/\{([\d\w_]+)\}/g, (word, $1) => {
        let res = data[$1] || '';
        delete data[$1]; // 将param在url中的参数删除，剩余的放进request body
        return res;
      });
      if (
        ['get', 'delete', undefined].indexOf(apiConfig[apiName].method) > -1 ||
        apiConfig[apiName].formData
      ) {
        newConfig.params = data;
      } else {
        newConfig.data = data;
      }
      if (newConfig.isStrangePost) {
        newConfig.params = data;
      }
    }

    if (interFaceType && CONFIG.obj[interFaceType]) {
      requestUrl = CONFIG.obj[interFaceType] + '/' + url;
    } else {
      requestUrl = CONFIG.obj.hj + '/' + url;
    }
    if (hasToken) {
      query[hasToken] = token;
      data[hasToken] = token;
    }

    if (method === 'post') {
      method = 'POST';
      requestUrl = URI(requestUrl)
        .query(query)
        .toString();
    }
    if (method === 'delete' && query) {
      requestUrl = URI(requestUrl)
        .query(data)
        .toString();
      // method = "POST";
    }
    if (method === 'get') {
      method = 'GET';
    }

    header = {
      'Content-Type': 'application/json',
      'X-Forward-School': 'kuaijiapp',
      ...header,
      clientType,
      token
    };
    // https://github.com/NervJS/taro/issues/2377
    // 配置h5端携带cookie
    h5RequestConfig =
      clientType === Taro.ENV_TYPE.WEB
        ? {
            mode: 'cors',
            credentials: 'include'
          }
        : {
            credentials: 'include'
          };
  };
  setData();
  // console.log(data)
  return new Promise((resolve, reject) => {
    const request = () => {
      if (isStrangePost) {
        requestUrl = URI(requestUrl)
          .query(data)
          .toString();
      }
      Taro.request({
        ...newConfig,
        url: requestUrl,
        method,
        data,
        header,
        ...h5RequestConfig
      })
        .then(res => {
          if (res.header['Set-Cookie']) {
            Taro.setStorageSync('sessionid', res.header['Set-Cookie']);
          }
          if (newConfig.crosFilter) {
            resolve(res);
            return;
          }
          //參考PC請求修改 --DD
          const { result, date, data: resData, msg, message, code } = res.data;

          // 官网商机接口有影响
          const alertMsg = msg || message || '服务器内部错误';
          // alert(needLogin_code.includes(code))

          if (code === 200 || code == 0) {
            if (typeof result != 'undefined') {
              resolve(result);
            } else if (typeof resData != 'undefined') {
              resolve(resData);
            } else if (typeof date != 'undefined') {
              resolve(date);
            } else {
              resolve('success');
            }
          } else if (needLogin_code.includes(code)) {
            Taro.removeStorageSync('token');
            // 小程序发起补token请求
            Taro.login().then(info => {
              fetch('loginWechat', {
                code: info.code,
                versionCode: '114',
                clientType: 'mp',
                sourceCode: 'kaoba'
              })
                .then(response => {
                  if (response.token) {
                    Taro.setStorageSync('token', response.token);
                    setData();
                    request();
                  } else {
                    let url = '/pages/bindPhone/index';
                    Taro.navigateTo({
                      url
                    });
                  }
                })
                .catch(error => {
                  let url = '/pages/bindPhone/index';
                  Taro.redirectTo({
                    url
                  });
                });
            });
          } else if (alertCode.includes(code)) {
            Taro.showToast({
              title: alertMsg,
              icon: 'none',
              duration: 2000
            });
            // reject(res)
          } else if (notAlertCode.includes(code)) {
            reject(res);
            // reject(res)
          } else {
            Taro.showToast({
              title: alertMsg,
              icon: 'none',
              duration: 2000
            });
            reject(res);
          }
        })
        .catch(error => {
          reject(error);
        });
    };
    request();
  });
}
