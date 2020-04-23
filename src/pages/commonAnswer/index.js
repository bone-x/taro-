import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, ScrollView } from "@tarojs/components";
import Fetch from "@/api/request";
import { connect } from "@tarojs/redux";
import { getOralTitleAnswer } from "../../actions/oraltitle";
import style from "./index.module.less";

@connect(state => state.oraltitle, { getOralTitleAnswer })
class AnswerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: [],
      done: [],
      title: ""
    };
  }
  config = {
    navigationBarTitleText: "答题卡",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentWillUnmount() {
    //组件卸载的时候
    // this.props.getOralTitleAnswer([]);
  }
  componentDidMount() {
    // 仿真拉练

    if (this.$router.params.type == 2) {
      this.getData();
    } else {
      // 课后作业

      this.setState({
        json: this.props.oraltitle,
        done: this.props.oraltitle
      });
      this.getClassData();
    }
  }
  getClassData = async () => {
    //获取课后作业数据
    let { sectionCode } = this.$router.params;
    let res = await Fetch("loadPractice", {
      sectionCode,
      testUsedType: 1,
      subjectSize: 15,
      isGetUndoSubject: false
    });
    this.setState({
      title: res.practiceTestTitle
    });
  };
  // 获取做题记录
  getData = async () => {
    let { done } = this.state;
    //获取试卷试题type==1拉链测试
    let { examId } = this.$router.params;
    let res = await Fetch("openExamPaper", { examId: examId });
    this.setState({ title: res.examName });

    res.subjectVOList.map(item => {
      done.push(item.examRecordDetail);
    });
    this.setState({
      json: res.subjectVOList,
      done
    });
    // this.collect(res.subjectVOList); //做收藏
    // this.setState({
    //   list: res.subjectVOList,
    //   countTime: res.examTime,
    //   allList: res
    // });
  };

  submitPaper = async () => {
    let { done } = this.state;
    let result = done && done.filter((item, index) => item !== null);
    let { type, recordId, practiceTestId, examId } = this.$router.params;
    if (result && result.length > 0) {
      // 仿真拉练提交试卷  //阶段测试
      if (type == 2) {
        let params = {
          recordId: recordId,
          examType: 9,
          isRedo: false
        };
        let res = await Fetch("submitExamPaper", params);
        //   POST /KaoBaexam/submitExamPaper
        //   if (done) {
        Taro.navigateTo({
          url: `/pages/Test/testResult/index?recordId=${recordId}&type=2`
        });
      } else {
        //课后作业
        let params1 = {
          practiceTestUuid: practiceTestId,
          isRedo: false
        };
        let res1 = await Fetch("doSubmitPracticePapers", params1);
        Taro.navigateTo({
          url: `/pages/Test/practiceTest/index?practiceTestId=${practiceTestId}`
        });
      }
    } else {
      Taro.showToast({
        title: "您是白卷噢！请做题后再交卷吧",
        icon: "none",
        duration: 2000
      });
    }
  };
  render() {
    const { done, json, title } = this.state;
    return (
      <View className={style.container}>
        <View className={style.header}>
          <View className={style.title}>{title}</View>
          <View className={style.line}></View>
        </View>
        <View className={style.scroll}>
          <ScrollView scrollY style="height: 100%">
            <View className={style.content}>
              {json.map((item, index) => {
                return (
                  <View
                    key={item.id}
                    className={
                      done[index]
                        ? `${style.content_item} ${style.action}`
                        : `${style.content_item} ${style.no_action}`
                    }
                  >
                    {index + 1}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View className={style.fixBottom} onClick={this.submitPaper}>
          <View className={style.footer}>交卷</View>
        </View>
      </View>
    );
  }
}

export default AnswerCard;
