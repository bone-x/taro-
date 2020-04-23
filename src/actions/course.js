import {
  ADDCOURSE,
  ADDSECTION,
  ADDCOURSELIST,
  ADDSECTIONLIST,
  ADDCOURSEINFO
} from "../constants/course";

// 正在点击查看的课程信息
export const addCourse = param => {
  return {
    type: ADDCOURSE,
    courseDetail: param
  };
};

// 学习报告课程列表缓存
export const addCourseList = param => {
  return {
    type: ADDCOURSELIST,
    courseList: param
  };
};

// 添加正在学习的信息
export const addSection = param => {
  return {
    type: ADDSECTION,
    sectionDetail: param
  };
};

// 缓存任务列表信息
export const addSectionList = param => {
  return {
    type: ADDSECTIONLIST,
    sectionList: param
  };
};

// 缓存课程信息
export const addCourseInfo = param => {
  return {
    type: ADDCOURSEINFO,
    courseInfo: param
  };
};
