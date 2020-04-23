import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image, ScrollView } from "@tarojs/components";
import NavHeader from "@/components/nav_header/index.jsx";
import Task from "@/components/task/task.jsx";
import fetch from "@/api/request.js";
import { connect } from "@tarojs/redux";
const app = Taro.getApp();

import "./course.less";
@connect(state => state.course)
class Index extends Component {
  constructor(props) {
    super(props);
    const courseStudying = this.props.sectionDetail;
    const courseDetail = this.props.courseDetail;
    console.log("this.props", this.props);

    this.state = {
      sectionList: [], // 课程详情的任务列表
      courseStudying: courseStudying || {}, // 当前正在学习的课次
      query: {
        trainId: "",
        classpalnId: "",
        title: ""
      },
      course: courseDetail,
      noteList: [], // 考霸笔记列表
      examDetail: {
        // 阶段测试实体
        examId: null,
        lockStatus: 0 // 1解锁 0未解锁
      },
      curTaskIndex: 1, // 正在学习的节
      isFirst: true // 是否第一次进来
    };
  }

  config = {
    navigationBarTitleText: "课程详情",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentWillMount() {
    const query = this.$router.params;
    this.setState({
      query: query
    });
  }
  componentDidMount() {
    let title = this.state.query.title;
    if (title) {
      Taro.setNavigationBarTitle({
        title: title.replace(/.*?(?:章)/, "阶段" + title.match(/第(.*?)章/)[1])
      });
    }
  }

  async componentDidShow() {
    const { query, course } = this.state;
    // 请求节信息
    fetch("getSessionDetail", query).then(res => {
      this.setState({
        sectionList: res.list
      });
    });

    // 请求试卷信息
    const param = {
      examType: 9,
      examInfoId: course.examId
    };
    // if(!param.examInfoId) return Taro.showToast({title: '还没有试卷',icon:'none'})
    const res = await fetch("getExamInfo", param);
    if (res) {
      console.log("getExamInfo", res);

      this.setState({
        examDetail: res
      });
    }
  }

  componentDidHide() {}

  // 数字转大写
  numberFormat = val => {
    const chinessNum = ["一二三四五六七八九", "十"];
    let tempStr = String(val)
      .split("")
      .reverse();
    let rs = tempStr.map((item, index) => {
      return index > 0 && item > 1
        ? [chinessNum[0].charAt(item - 1), chinessNum[index]].join("")
        : chinessNum[index].charAt(item - 1);
    });
    return rs.reverse().join("");
  };

  // 课次完成，星加1
  addStarNum = (index, type) => {
    let { sectionList } = this.state;
    sectionList[index].noteLock = true;
    sectionList[index].starNum = type == "noteLock" ? 3 : 2;
    console.log(sectionList[index].starNum);
    this.setState({
      sectionList: sectionList
    });
  };

  toggleTask = index => {
    this.setState({
      curTaskIndex: index,
      isFirst: false
    });
  };

  goToTest = () => {
    app.globalData.examId = this.state.course.examId;
    Taro.navigateTo({
      url: `/pages/Test/testHomeWork/index?examId=${app.globalData.examId}`
    });
  };

  render() {
    let {
      sectionList,
      courseStudying,
      query,
      noteList,
      examDetail,
      curTaskIndex,
      isFirst
    } = this.state;
    if (sectionList.length == 0) return;
    let startNum = 0;
    // 列表数据预处理
    sectionList = sectionList.map((item, index) => {
      item.index = index + 1;
      startNum += item.starNum;
      if (item.trainId == courseStudying.trainId) {
        // 当前正在直播的任务
        isFirst && (curTaskIndex = item.index);
        item.playing = true;
      } else {
        item.playing = false;
      }
      return item;
    });

    const allDone = startNum == sectionList.length * 3; // 是否全部课次都已完成
    return (
      <View className="bgGray flex">
        <View className="flex-top">
          <View className="pure_top"></View>
          <View className="adjust-pos">
            <NavHeader
              course={query}
              title={"任务" + this.numberFormat(curTaskIndex)}
              curProgress={startNum}
              totalProgress={sectionList.length * 3}
            ></NavHeader>
          </View>
        </View>
        <View className="flex-bottom">
          <ScrollView scrollY style="height: 100%">
            {sectionList.map(item => {
              return (
                <Task
                  course={item}
                  noteList={noteList}
                  onOpen={this.toggleTask}
                  addStarNum={this.addStarNum}
                  open={item.playing}
                ></Task>
              );
            })}

            <View
              className="panel"
              onClick={
                allDone
                  ? () => {}
                  : () =>
                      Taro.showToast({
                        title: "请先完成前面的课次学习后再来吧",
                        icon: "none"
                      })
              }
            >
              <View className="panel-top">
                <View className="prefix"></View>
                <View className="block">
                  <View className="block-left">
                    <View>
                      <Text className="stageName">
                        {query.title.slice(query.title.indexOf("章") + 2)}{" "}
                        阶段测试
                      </Text>
                      <View className="timeMsg">
                        <Text className="text">
                          测试时长：{examDetail.examTime}分钟
                        </Text>
                        <Text className="text">
                          总分数：{examDetail.paperScore}分
                        </Text>
                        <View className="lock">完成本阶段所有任务即可解锁</View>
                      </View>
                    </View>
                  </View>
                  <View className="block-right">
                    {allDone ? (
                      examDetail.status != 7 ? (
                        <Button className="opt" onClick={this.goToTest}>
                          开始测试
                        </Button>
                      ) : (
                        <Button
                          className="opt mainColor"
                          onClick={() =>
                            Taro.navigateTo({
                              url:
                                "/pages/Test/testResult/index?recordId=" +
                                examDetail.recordId
                            })
                          }
                        >
                          查看结果
                        </Button>
                      )
                    ) : (
                      <Image
                        className="img"
                        src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/lock.png"
                      ></Image>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Index;
