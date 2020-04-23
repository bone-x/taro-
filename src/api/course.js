/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-03-09 09:37:34
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-09 14:21:25
 */
export default {
  // 任务阶段列表
  getCourseList: {
    url: 'mixunban/app/listCourses',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },

  // 任务阶段——课程章列表
  getChapterList: {
    url: 'learningCenter/app/listCourseSection',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },

  // 课程详情——节信息
  getSessionDetail: {
    url: 'learningCenter/app/getLessonsDetail',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },

  // 课程详情——考霸笔记
  getNoteList: {
    url: 'mixunban/app/courseDetailDespotNote',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },

  // 课程详情——解锁考霸笔记
  unLockLessonsStatus: {
    url: 'learningCenter/app/unLockLessonsStatus',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },

  // 课程详情——获取试卷id
  getExamId: {
    url: 'learningCenter/app/getExerciseUrl',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  },

  // 课程详情——获取阶段测试试卷信息
  getExamDetail: {
    url: 'mixunban/app/courseDetailDespotNote',
    method: 'get',
    interFaceType: 'live',
    hasToken: 'SSOTOKEN',
    header: {
      'Content-Type': 'application/json'
    }
  }
};
