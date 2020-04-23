/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-03-06 09:48:38
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-17 11:17:19
 */
export default {
  // 获取错题
  getErrorSubjectList: {
    url: 'kaoba/errorHistory/getErrorHistorySectionList',
    interFaceType: 'tk2',
    method: 'get',
    hasToken: 'token'
  },
  // 我的收藏
  getLoadFavorites: {
    url: 'kaoBanoteBook/faviconList',
    interFaceType: 'tk2',
    method: 'get'
  },
  // 提交单个答案
  getDoExamSubject: {
    url: 'KaoBaexam/doExamSubject',
    interFaceType: 'tk2',
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  getCourseInfo: {
    url: 'kaoba/courseInfo/getCourseInfo',
    interFaceType: 'tk2',
    method: 'get',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
};
