/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-13 17:50:37
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-16 10:11:33
 */
import Taro from '@tarojs/taro';
import { LOGIN, CHANGELOGINLOADING } from '../constants/login';
import fetch from '../api/request';

const app = Taro.getApp();

export const login = res => {
  return {
    type: LOGIN,
    token: res
  };
};
export const change = res => {
  return {
    type: CHANGELOGINLOADING,
    payload: res
  };
};

export function changeLoginLoading(status) {
  return dispatch => {
    dispatch(change(status));
  };
}
// 异步的action
export function dispatchLogin(formData) {
  return dispatch => {
    const login_async = (reslove, reject) => {
      return Taro.getUserInfo()
        .then(({ userInfo, encryptedData, iv }) => {
          app.globalData.userInfo = Object.assign(
            app.globalData.userInfo,
            userInfo
          );
          Taro.login().then(info => {
            formData.wxNickname = userInfo.nickName;
            formData.encryptedData = encryptedData;
            formData.iv = iv;
            formData.code = info.code;
            formData.sourceCode = 'kaoba';
            fetch('bindPhone', formData)
              .then(res => {
                console.log(12323);
                return Taro.login()
                  .then(info => {
                    console.log(1);
                    return fetch('loginWechat', {
                      code: info.code,
                      versionCode: '114',
                      clientType: 'mp',
                      sourceCode: 'kaoba'
                    }).then(subres => {
                      console.log(2);
                      dispatch(login(subres.token));
                      Taro.setStorageSync('token', subres.token);
                      Taro.setStorageSync('phone', formData.mobileNo);
                      fetch('getPurchaseStatu').then(res => {
                        const { purchaseStatus } = res;
                        Taro.setStorageSync('purchaseStatus', purchaseStatus);
                        switch (purchaseStatus) {
                          case 1:
                            Taro.redirectTo({
                              url: '/pages/entryTest/index?status=1'
                            });
                            break;
                          case 2:
                            Taro.redirectTo({
                              url: '/pages/entryTest/index?status=2'
                            });
                            break;
                          case 3:
                            Taro.redirectTo({
                              url: '/pages/classList/class-list'
                            });
                            break;
                          default:
                            break;
                        }
                      });
                    });
                  })
                  .then(() => {
                    console.log(3);
                    reslove();
                  })
                  .catch(() => {
                    console.log(4);
                    reslove();
                  });
              })
              .catch(err => {
                // 密码登录错误
                // reslove(err.data)
                if (err.data.code == 500) {
                  Taro.showToast({
                    title: '请先关注恒企教育公众号',
                    icon: 'none',
                    duration: 2000,
                    success: function() {
                      setTimeout(() => {
                        Taro.switchTab({
                          url: '/pages/index/index'
                        });
                      }, 2000);
                    }
                  });
                } else if (err.data.code == 402) {
                  Taro.showToast({
                    title: err.data.message,
                    icon: 'none',
                    duration: 2000
                  });
                  reslove(err.data);
                } else {
                  reslove(err.data);
                }
              });
          });
        })
        .catch(err => {
          Taro.redirectTo({
            url: '/pages/index/index'
          });
          // new Promise(login_async);
          reject(err);
        });
    };
    return new Promise(login_async);
  };
}
