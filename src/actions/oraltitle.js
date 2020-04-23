import { ORALTITLE,CLASSTITLE } from "../constants/oraltitle";

// 获取入营测试提交答案
export const getOralTitleAnswer = res => {
  return {
    type: ORALTITLE,
    oraltitle: res
  };
};

// 获取入营测试提交答案
export const getclasstitle = res => {
  return {
    type: CLASSTITLE,
    classtitle: res
  };
};
