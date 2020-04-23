import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Fetch from "@/api/request";
import style from "./answer-card.module.less";
@connect(state => state.oraltitle)
class AnswerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: [],
      done: [],
      examScore: 0, //试卷分数
      isDo: 0,
      title: "",
      loading: false
    };
  }
  config = {
    navigationBarTitleText: "答题卡",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
    this.openPaper();
    this.getReadyDo();
  }

  //   componentDidShow() {
  //     this.getEvaluatedStatus();
  //   }
  //   getEvaluatedStatus = async () => {
  //     let res = await Fetch("getEvaluatedStatus", {
  //       paperId: this.$router.params.paperId
  //     });
  //     this.setState({ isDo: res }); //评测状态：0未做，1已做，2过期，-1异常
  //   };
  getReadyDo = () => {
    let { oraltitle } = this.props;
    let res =
      oraltitle &&
      oraltitle.detailList.map((item, index) => item.studentAnswer);
    oraltitle && this.setState({ done: res });
  };
  openPaper = async () => {
    //获取试卷试题
    let paperId = this.$router.params.paperId;
    let res = await Fetch("openPaper", {
      paperId
    });
    this.setState({
      json: res.subjectList,
      examScore: res.totalScore,
      title: res.paperName
    });
  };
  submitPaper = async () => {
    let { oraltitle } = this.props;
    let { examScore, loading } = this.state;
    let { paperId } = this.$router.params;
    let obj = oraltitle && oraltitle.detailList.filter(Boolean);
    oraltitle && (oraltitle["detailList"] = obj);
    console.log(1);
    if (oraltitle) {
      if (loading) {
        return;
      }
      this.setState({ loading: true });
      try {
        let res = await Fetch("submitPaper", { ...oraltitle });
        this.setState({ loading: false });
        res &&
          Taro.navigateTo({
            url: `/pages/Test/testOralResult/index?paperId=${paperId}&examScore=${examScore}`
          });
      } catch (error) {
        this.setState({ loading: false });
        const { code } = error.data;
        if (code === 500) {
          Taro.redirectTo({
            url: "/pages/entryTest/index?status=2"
          });
        }
      }
    } else {
      this.setState({ loading: false });
      Taro.showToast({
        title: "您是白卷噢！请做题后再交卷吧",
        icon: "none",
        duration: 2000
      });
    }
  };
  render() {
    const { json, done, title } = this.state;

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
        <View className={style.fixBottom}>
          <Button
            className={style.footer}
            onClick={this.submitPaper}
            loading={this.state.loading}
          >
            交卷
          </Button>
        </View>
      </View>
    );
  }
}

export default AnswerCard;
