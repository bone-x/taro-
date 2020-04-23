/*
 * @Author: your name
 * @Date: 2020-03-05 08:57:08
 * @LastEditTime: 2020-03-09 15:16:52
 * @LastEditors: 邓达
 * @Description: In User Settings Edit
 * @FilePath: \Intensive_trainMini\src\api\live.js
 */
export default {
  //直播接口
  getLiveInfo: {
    url: 'learningCenter/app/getLiveInfo',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  },
  //录播接口
  getReplayInfo: {
    url: 'learningCenter/app/getReplayInfo',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  },
  //获取笔记列表
  queryLiveNotes: {
    url: 'learningCenter/app/teachnote/queryLiveNotes',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  },
  //保存笔记
  saveOrUpdate: {
    url: 'learningCenter/app/teachnote/saveOrUpdate',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      // "Content-Type": "application/json"
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  },
  //删除笔记
  getDeleteNote: {
    url: 'learningCenter/app/teachnote/delete',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  },
  //观看视频解锁课后作业
  unlockHomeWork: {
    url: 'learningCenter/app/UnlockHomeWork',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }
  //直播回放获取练习题列表
  // getExercisesList: {
  //   url: "learningCenter/teachExercises/getExercisesList",
  //   interFaceType: "live",
  //   hasToken: 'SSOTOKEN',
  //   header: {
  //     "Content-Type": "application/json"
  //   },
  //   method: "GET"
  // },
  // //查看是否已做题
  // checkUserJobIsExist: {
  //   url: "learningCenter/teachExercises/checkUserJobIsExist",
  //   interFaceType: "live",
  //   hasToken: 'SSOTOKEN',
  //   header: {
  //     "Content-Type": "application/json"
  //   },
  //   method: "GET"
  // },
};
