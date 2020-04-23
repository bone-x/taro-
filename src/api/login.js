/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-11 15:11:09
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-10 17:11:06
 */
export default {
  // 注册
  register: {
    url: 'api/register',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    },
    isStrangePost: true //为了迎合后端不规范的post请求进行的兼容
  },
  //图形验证码
  getCaptcha: {
    url: 'api/captcha-image',
    method: 'get',
    interFaceType: 'jq',
    responseType: 'arraybuffer',
    crosFilter: true,
    noCookie: true,
    header: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  //短信验证码
  getSmS: {
    url: 'api/otpSMS',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    }
  },
  //微信code登录
  loginWechat: {
    url: 'api/loginxcx',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  //微信用户绑定手机
  bindPhone: {
    url: 'api/widgetBinding',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  //邮箱验证码
  getMail: {
    url: 'api/otpMail',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    }
  },
  //手机验证码
  validateSmS: {
    url: 'api/otpSMS',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    }
  },
  //手机号码找回密码
  findPassWord: {
    url: '/api/passwordPhone',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    }
  },
  // 邮箱验证密码重置
  getAppEmailPwd: {
    url: 'api/appEmailPwd',
    method: 'post',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    }
  },
  // 邮箱验证密码重置
  getUserInfo: {
    url: 'api/userInfo',
    method: 'get',
    interFaceType: 'jq',
    header: {
      'Content-Type': 'application/json'
    }
  },
  //是否有报名
  getPurchaseStatu: {
    url: 'mixunban/app/getPurchaseStatus',
    method: 'get',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },
  // 获取入营测试试卷id
  campTestExamId: {
    url: 'mixunban/app/campTestExamId',
    method: 'get',
    header: {
      'Content-Type': 'application/json'
    }
  }
};
