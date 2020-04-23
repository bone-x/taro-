import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import "taro-ui/dist/style/index.scss";
import "./app.less";
import configStore from "./store";
import Index from "./pages/index";
import "./utils/mtj-wx-sdk";

const oss = 123;
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentDidHide() {}

  componentDidCatchError() {}

  globalData = {
    userInfo: {},
    token: "",
    nickName: "",
    liveData: {}, //直播用的课程详情参数
    trainId: 0, // 课后作业的节id
    examId: 0, // 考试id
    courseAllDone: false // 是否全部课程章节已学完
  };
  config = {
    pages: [
      "pages/index/index", //首页落地页
      "pages/bookSuccess/index", //预约成功
      "pages/studyReport/report-finished", //已完成报告
      "pages/studyReport/report-unfinished", //未完成报告
      // "pages/liveRoom/live-room", //直播
      "pages/honour/honour", //荣誉勋章页
      "pages/classList/class-list", //课程列表
      "pages/bindPhone/index", //登录
      "pages/course/course",
      "pages/entryTest/index", //入营测试
      "pages/zipper/zipper", //仿真拉练
      "pages/answerCard/answer-card", //入营测试的答题卡
      "pages/commonAnswer/index", //仿真,拉链，课后习题的答题卡
      "pages/book/book", //错题本，收藏本
      "pages/videoParsing/index", //试题错题解析
      "pages/mistakeBook/index" //试题本
      //   "pages/Test/classHomeWork/index", //课后作业练习
      //   "pages/Test/testResult/index", //仿真拉链和阶段测试的测试结果
      //   "pages/Test/practiceTest/index" //练习题测试结果
    ],
    subpackages: [
      {
        root: "personCenter",
        pages: [
          "pages/personalCenter/signLog/index", // 个人中心-协议
          "pages/personalCenter/findPassword/index", // 忘记密码
          "pages/personalCenter/index/index" // 个人中心
        ]
      },
      {
        root: "pages/Test",
        pages: [
          "testHomeWork/index", //仿真拉链和阶段测试做题
          "testOralResult/index", //入营测试的测试结果
          "oralHomeWork/index", //入营测试做题
          "classHomeWork/index", //课后作业练习
          "testResult/index", //仿真拉链和阶段测试的测试结果
          "practiceTest/index", //练习题测试结果
          "allTestAnalysis/index"
        ]
      },
      {
        root: "liveRoom",
        pages: ["pages/liveHome/live-room"]
      }
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    }
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
