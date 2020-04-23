import { ADDCOURSE, ADDSECTION, ADDCOURSELIST, ADDSECTIONLIST, ADDCOURSEINFO } from "../constants/course";

const INITIAL_STATE = {
  courseDetail: null,
  sectionDetail: null,
  courseList: [],
  sectionList: [],
  courseInfo:null,
}

export default function courseReducer (state = INITIAL_STATE, action) {
  switch(action.type) {
    case ADDCOURSE:
      return {
        ...state,
        courseDetail: action.courseDetail // 当前正在学习的课次
    }
    case ADDSECTION:
      return {
        ...state,
        sectionDetail: action.sectionDetail // 当前正在学习的课次
    }
    case ADDCOURSELIST:
      return {
        ...state,
        courseList: action.courseList // 课程列表
    }
    case ADDSECTIONLIST:
      return {
        ...state,
        sectionList: action.sectionList // 任务列表
    }
    case ADDCOURSEINFO:
      return {
        ...state,
        courseInfo: action.courseInfo //课程信息
      }
    default:
      return state
  }
}
