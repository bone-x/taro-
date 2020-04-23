import Taro, { Component } from "@tarojs/taro";

// const obj = {
//   hj: '/hjBaseUrl', // mock 、production、test
//   jq: '/authBaseUrl',
//   lj: '/ljBaseUrl',
// }
const obj = {
  hj: "/hjBaseUrl", // mock 、production、test
  // jq: 'http://zkpc.beta.hqjy.com',
  jq: "https://zkpcbeta.hqjy.com/userinfo", // 鉴权接口
  // jq:'https://promotion.hqjy.com/userinfo', // 鉴权接口
  lj: "/ljBaseUrl",
  // gw: 'http://10.0.98.27:8080/promotion'
  gw: "http://10.0.135.102/promotion/",
  live: "https://lctestkuaiji.beta.hqjy.com",
  tk: "http://10.0.99.46:8086/tiku_external",
  tk2: "https://tikuweapp.beta.hqjy.com/ajax"
  //   tk2: "http://10.0.132.174:8081/tiku_api/"
};

console.log("env: ", Taro.getEnv(), Taro.ENV_TYPE.WEAPP);
// if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
// obj.hj = 'http://10.0.98.218:10030/expert',
// obj.hj = 'http://hengqihj-gateway.beta.hqjy.com/expert'
// obj.lj = 'http://lctesthangjia.beta.hqjy.com',
// obj.jq = 'http://hangjiah5.beta.hqjy.com'
// obj.jq = 'http://10.0.19.212:8082'

// obj.hj = 'https://mpbeta.hqjy.com/gw'
// obj.lj = 'https://mpbeta.hqjy.com/lctesthangjia'
// obj.jq = 'https://mpbeta.hqjy.com/hangjiah5'
// obj.jq = 'http://10.0.19.212:8099'
// }

export default {
  obj
};
