export default {
  // --------------入营测试
  //直播接口
  //   getEvaluatedStatus: {
  //     //入营测试的 状态  0 未做
  //     url: "kaoba/cpEvaluate/getEvaluatedStatus",
  //     interFaceType: "tk2",
  //     header: {
  //       "Content-Type": "application/json"
  //     },
  //     method: "get"
  //   },

  getPaperInfo: {
    //获取试卷信息
    url: "kaoba/cpEvaluate/getPaperInfo",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  openPaper: {
    //获取试卷试题
    url: "kaoba/cpEvaluate/openPaper",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post"
  },
  submitPaper: {
    //入营提交试卷
    url: "kaoba/cpEvaluate/submitPaper",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "post"
  },
  getReport: {
    //入营的考试报告
    url: "kaoba/cpEvaluate/getReport",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  subscribeGoods: {
    //入营的考试报告
    url: "mixunban/app/subscribeGoods",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //   -------------------------------------------阶段测试
  updateNoteBook: {
    //收藏
    url: "kaoBanoteBook/updateNoteBook",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "Post"
  },
  getExamList: {
    //这里是测试结果 ---阶段测试和仿真拉练
    url: "KaoBaexam/getExamList",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  getExamInfo: {
    // 是否有做过阶段测试 ---阶段测试和仿真拉练
    url: "KaoBaexam/getKaoBaExamInfo",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  //-------------------------------------=课后习题
  loadPractice: {
    //生成课后练习
    url: "kaoBapractice/loadPractice",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },

  //   getExamAnalysis: {
  //     //这里是测试结果 ---阶段测试和仿真拉练
  //     url: "KaoBaexam/getExamAnalysis",
  //     interFaceType: "tk2",
  //     header: {
  //       "Content-Type": "application/json"
  //     },
  //     method: "get"
  //   },
  getExamResultReport: {
    //这里是测试试卷结果
    url: "KaoBaexam/getExamResultReport",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  openExamPaper: {
    //阶段测试和拉链测试  type==1
    url: "KaoBaexam/openExamPaper",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  doExamSubject: {
    //阶段测试和拉链测试做题（拿到单个试题） type==1
    url: "KaoBaexam/doExamSubject",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post"
  },
  doSubmitSubjectAnswer: {
    // 课后作业提交单个答案
    url: "kaoBapractice/submitSubjectAnswer",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post"
  },
  doSubmitSubjectAnswer: {
    // 课后作业提交单个答案
    url: "kaoBapractice/submitSubjectAnswer",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post"
  },
  queryPracticeTranscript: {
    // 练习试卷
    url: "kaoBapractice/queryPracticeTranscript",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  submitExamPaper: {
    // 拉链测试
    url: "KaoBaexam/submitExamPaper",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post"
  },
  doSubmitPracticePapers: {
    // 课后作业提交试卷
    url: "kaoBapractice/submitPracticePapers",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post"
  },
  unLockOverloadNote: {
    // 解锁 笔记，大于90%
    url: "/learningCenter/web/unLockOverloadNote",
    header: {
      "Content-Type": "application/json"
    },
    hasToken: "SSOTOKEN",
    method: "get"
  },
  getEvaluatedStatus: {
    // 入营测试是否已做过
    url: "kaoba/cpEvaluate/getEvaluatedStatus",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  },
  completeSection: {
    // 完成阶段测试
    url: "/learningCenter/web/completeSection",
    header: {
      "Content-Type": "application/json"
    },
    hasToken: "SSOTOKEN",
    method: "get"
  },
  getExamAnalysis: {
    // 完成阶段测试
    url: "/KaoBaexam/getExamAnalysis",
    interFaceType: "tk2",
    header: {
      "Content-Type": "application/json"
    },
    method: "get"
  }
};
