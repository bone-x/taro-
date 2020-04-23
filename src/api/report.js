export default {
  //课次报告接口
  getSectionReport:{
    url: 'practice/getSectionStudyReport',
    interFaceType: "tk2",
    hasToken:"SSOTOKEN",
    header: {
      'Content-Type': "application/json",
    },
    method: 'GET'
  },
  // 课程报告
  getCourseReport:{
    url: 'practice/getCourseStudyReport',
    interFaceType: "tk2",
    hasToken:"SSOTOKEN",
    header: {
      'Content-Type': "application/json",
    },
    method: 'GET'
  },
  // 课程听课时长
  getCourseDuration:{
    url: 'mixunban/app/getCourseDuration',
    interFaceType: "live",
    hasToken:"SSOTOKEN",
    header: {
      'Content-Type': "application/json",
    },
    method: 'GET'
  },
  // 课次听课时长
  getClassPlanLiveDuration:{
    url: 'mixunban/app/getClassPlanLiveDuration',
    interFaceType: "live",
    hasToken:"SSOTOKEN",
    header: {
      'Content-Type': "application/json",
    },
    method: 'GET'
  },
  // 出勤率
  getAttendance:{
    url: 'mixunban/app/getAttendance',
    interFaceType: "live",
    hasToken:"SSOTOKEN",
    header: {
      'Content-Type': "application/json",
    },
    method: 'GET'
  },
}