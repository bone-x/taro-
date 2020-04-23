export default {
  //仿真拉练接口
  getPracticeInfo: {
    url: "KaoBaexam/getExamList",
    interFaceType: "tk2",
    hasToken:"SSOTOKEN",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
}