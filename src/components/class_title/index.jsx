import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText, Image } from "@tarojs/components";
import fetch from "@/api/request.js";
import { connect } from "@tarojs/redux";
import "./index.less";
import { getclasstitle } from "../../actions/oraltitle";

@connect(state => state.oraltitle, { getclasstitle })
class CourseList extends Component {
  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    this.state = {
      answerList: [],
      typeList: {},
      arr: [],
      currIndex: [],
      isTrue: null,
      // 记录查看按钮是否打开
      openBtn: []
    };
  }

  componentDidMount() {
    let { arr, openBtn } = this.state;
    let res = arr.filter(item => item != "");
    if (res.length > 0) {
      return false;
    } else {
      arr = new Array(this.props.allList.priacticeList.length).fill("");
      openBtn = new Array(this.props.allList.priacticeList.length).fill("");
      this.setState({
        arr,
        currIndex: arr,
        answerList: this.props.allList,
        openBtn
      });
      this.props.getclasstitle(arr);
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // let { arr, openBtn } = this.state;
    // let res = arr.filter(item => item != "");
    // if (res.length > 0) {
    //   return false;
    // } else {
    //   arr = new Array(nextProps.allList.priacticeList.length).fill("");
    //   openBtn = new Array(nextProps.allList.priacticeList.length).fill("");
    //   this.setState({
    //     arr,
    //     currIndex: arr,
    //     answerList: nextProps.allList,
    //     openBtn
    //   });
    //   this.props.getclasstitle(arr);
    // }
  }

  lookBtnClick() {
    let { subjectAnswer } = this.props.item; //答案

    let { openBtn } = this.state;
    if (openBtn[this.props.curr] === this.props.curr) {
      openBtn.splice(this.props.curr, 1, "");
    } else {
      openBtn.splice(this.props.curr, 1, this.props.curr);
    }
    console.log(openBtn);
    this.setState({
      openBtn
    });
  }

  topicAnswerclick(item) {
    if (this.state.openBtn[this.props.curr] !== "") return false;
    let isTrue = "";
    let { arr } = this.state;
    if (
      this.props.item.subjectTypeId === 1 ||
      this.props.item.subjectTypeId === 3
    ) {
      isTrue =
        item.subjectOption === this.props.item.subjectAnswer ? true : false;

      arr.splice(this.props.curr, 1, item.subjectOption);

      this.setState({
        arr: arr,
        isTrue: isTrue
      });
    } else if (this.props.item.subjectTypeId === 2) {
      // 多选
      let { currIndex } = this.state;

      if (currIndex[this.props.curr] === "") {
        currIndex[this.props.curr] += item.subjectOption;
      } else {
        let temp = currIndex[this.props.curr].split(",");
        let index = temp.indexOf(item.subjectOption);

        if (index === -1) {
          temp.push(item.subjectOption);
        } else {
          temp.splice(index, 1);
        }
        let rs = temp.join(",");

        currIndex[this.props.curr] = rs;
      }
      // currIndex[this.props.curr] === ''?currIndex[this.props.curr]+=item.subjectOption:currIndex[this.props.curr]+=`,${item.subjectOption}`

      this.setState({
        currIndex
      });
      arr.splice(this.props.curr, 1, currIndex[this.props.curr]);

      this.setState({
        arr: arr
      });

      isTrue =
        arr[this.props.curr]
          .split(",")
          .sort()
          .join(",") === this.props.item.subjectAnswer
          ? true
          : false;
      this.setState({ isTrue });

      // this.props.item.subjectAnswer.search(arr[this.props.curr]) != -1
      //   ? true
      //   : false;
      //   console.log(arr);
      //   console.log(this.props.item.subjectAnswer);
      //   console.log("-------------");
      //   console.log(isTrue);
      //   console.log("-------------");
    }

    const { answerList } = this.state;

    let params = {
      practiceTestId: answerList.practiceTestId,
      subjectId: item.subjectId,
      subjectTypeId: this.props.item.subjectTypeId,
      parentId: this.props.item.parentId,
      studentAnswer: this.state.arr[this.props.curr]
        .split(",")
        .sort()
        .join(","),
      subjectAnswer: this.props.item.subjectAnswer,
      subjectSore: this.props.item.score,
      selfEvaluation: true
    };

    fetch("doSubmitSubjectAnswer", params).then(res => {
      console.log(res);
      // Taro.showToast({
      //   title: '成功',
      //   duration: 2000
      // });
    });

    this.props.getclasstitle(arr);
  }

  goLookAnalysis = val => {
    Taro.navigateTo({
      url: `/pages/videoParsing/index?VID=${val}`
    });
  };

  render() {
    let { typeList, arr, isTrue, openBtn } = this.state;
    const { item, curr } = this.props;

    return (
      <View className="exercise-list">
        <View className="topic-title">
          <RichText nodes={item.subjectName} />
        </View>
        <View className="topic-answer-box">
          {item
            ? item.subjectAnswerList.map(k => {
                return (
                  <View
                    className={
                      item.subjectTypeId === 2
                        ? arr[curr].search(k.subjectOption) != -1
                          ? "topic-answer-y"
                          : "topic-answer-n"
                        : arr[curr] === k.subjectOption
                        ? "topic-answer-y"
                        : "topic-answer-n"
                    }
                    key={k.id}
                    onClick={this.topicAnswerclick.bind(
                      this,
                      k,
                      typeList.selectType
                    )}
                  >
                    <Text
                      style={
                        item.subjectTypeId === 1 || item.subjectTypeId === 3
                          ? "display: inline-block"
                          : "display: none"
                      }
                      className={
                        arr[curr] === k.subjectOption
                          ? "topic-order-sheet-y"
                          : "topic-order-sheet-n"
                      }
                    >
                      {k.subjectOption}
                    </Text>
                    <Text
                      style={
                        item.subjectTypeId === 2
                          ? "display: inline-block"
                          : "display: none"
                      }
                      className={
                        arr[curr].search(k.subjectOption) != -1
                          ? "topic-order-multi-y"
                          : "topic-order-multi-n"
                      }
                    >
                      {k.subjectOption}
                    </Text>
                    {/* <Text className="answer-content">{k.memo}</Text> */}
                    <View className='answer-content'>
                      <RichText nodes={k.memo} />
                    </View>
                  </View>
                );
              })
            : ""}
        </View>
        {/* 课后作业有查看答案 */}
        <View
          className="look-btn-box"
          style={arr[curr] !== "" ? "display: block" : "display:none"}
        >
          <Text onClick={this.lookBtnClick.bind(this)} className="look-btn">
            {openBtn[curr] === curr ? "收起答案" : "查看答案"}
          </Text>
        </View>
        <View
          className="answer-box"
          style={openBtn[curr] === curr ? "display:block" : "display:none"}
        >
          <Image
            className="right-img"
            src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/${
              isTrue ? "report/right" : "wrong"
            }.png`}
          />
          <Text>
            {`${isTrue ? "答对了" : "答错了"}，正确答案是：`}
            <Text className="right">{item.subjectAnswer}</Text>
          </Text>
          <View className="analysis">解析</View>
          <View className="analysis-content">
            <RichText nodes={item.subjectAnalysis} />
          </View>
          <View
            className="look-video"
            style={
              item && item.subjectVideo !== ""
                ? "display: block"
                : "display:none"
            }
          >
            <Text
              onClick={this.goLookAnalysis.bind(this, item.subjectVideo)}
              className="look-video-btn"
            >
              查看视频解析
            </Text>
          </View>
          {/* <View className='video-box'>
            <Video className='video' controls src='http://video-qn.51miz.com/preview/video/00/00/11/28/V-112819-996834F7.mp4' />
          </View> */}
        </View>
      </View>
    );
  }
}

export default CourseList;
