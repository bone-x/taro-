import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.less";
import { getOralTitleAnswer } from "../../actions/oraltitle";

@connect(state => state.oraltitle, { getOralTitleAnswer })
class CourseList extends Component {
  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    this.state = {
      typeList: {},
      arr: [],
      currIndex: [],
      paramAnswer: {},
      answerList: []
    };
  }

  componentDidMount() {
    this.setState({
      typeList: this.props.list
    });
  }

  componentWillReceiveProps(nextProps) {
    let { arr, answerList } = this.state;
    let res = arr.filter(item => item != "");
    let res1 = answerList.filter(item => item != "");
    if (res.length > 0) {
      return false;
    } else {
      arr = new Array(nextProps.allList.subjectList.length).fill("");
      let arr2 = [];
      nextProps.allList.subjectList.map(k => {
        let obj = {};
        (obj.diffcult = k.diffcult),
          (obj.groupId = k.groupId),
          (obj.groupName = k.groupName),
          (obj.isTrue = ""),
          (obj.memoList = []),
          (obj.score = k.score),
          (obj.studentAnswer = ""),
          (obj.subjectId = k.subjectId),
          (obj.subjectName = k.subjectName);
        arr2.push(obj);
      });
      // answerList = new Array(nextProps.allList.subjectList.length).fill("");
      this.setState({ arr, currIndex: arr, answerList: arr2 });
    }
  }

  lookBtnClick() {
    this.setState({
      answerShow: !this.state.answerShow
    });
  }

  topicAnswerclick(item) {
    let isTrue = "";
    let memoList = [];
    let { arr, answerList, paramAnswer } = this.state;
    if (
      this.props.item.subjectTypeId === 1 ||
      this.props.item.subjectTypeId === 3
    ) {
      // 单选
      isTrue =
        item.subjectOption === this.props.item.subjectAnswer ? true : false;
      item["id"] = item.subjectAnswerId;
      memoList.push(item);
      arr.splice(this.props.curr, 1, item.subjectOption);

      this.setState({
        arr
      });
    } else if (this.props.item.subjectTypeId === 2) {
      // 多选
      let { currIndex } = this.state;
      isTrue =
        this.props.item.subjectAnswer.search(item.subjectOption) != -1
          ? true
          : false;

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
      // currIndex[this.props.curr] === ""
      //   ? (currIndex[this.props.curr] += item.subjectOption)
      //   : (currIndex[this.props.curr] += `,${item.subjectOption}`);
      this.setState({
        currIndex
      });
      arr.splice(this.props.curr, 1, currIndex[this.props.curr]);

      this.setState({
        arr
      });
      //   console.log(this.props.item, '555555')
      let answerArr = this.state.arr[this.props.curr].split(",");
      answerArr.map(item => {
        this.props.item.subjectAnswerList.map(k => {
          if (item === k.subjectOption) {
            memoList.push(k);
            memoList.push({ id: item["subjectAnswerId"] });
          }
        });
      });
    }

    let params = {
      diffcult: this.props.item.diffcult,
      groupId: this.props.item.groupId,
      groupName: this.props.item.groupName,
      isTrue: isTrue,
      memoList: memoList,
      score: this.props.item.score,
      studentAnswer: this.state.arr[this.props.curr]
        .split(",")
        .sort()
        .join(","),
      subjectId: this.props.item.subjectId,
      subjectName: this.props.item.subjectName
    };

    answerList.splice(this.props.curr, 1, params);
    paramAnswer.detailList = answerList;
    paramAnswer.paperId = this.props.allList.paperId;
    this.setState({
      paramAnswer
    });

    //将答案缓存到redux
    this.props.getOralTitleAnswer(this.state.paramAnswer);
  }

  render() {
    let { typeList, arr } = this.state;
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
                    <View className="answer-content">
                      <RichText nodes={k.memo} />  
                    </View>
                  </View>
                );
              })
            : ""}
        </View>
        {/* 课后作业有查看答案，测试没有 */}
        {/* <View
          className="look-btn-box"
          style={
            typeList.isAfterClass === 0 ? "display: block" : "display:none"
          }
        >
          <Text onClick={this.lookBtnClick.bind(this)} className="look-btn">
            {this.state.answerShow ? "收起答案" : "查看答案"}
          </Text>
        </View>
        <View
          className="answer-box"
          style={this.state.answerShow ? "display:block" : "display:none"}
        >
          <Image
            className="right-img"
            src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/report/right.png"
          />
          <Text>
            答对了，正确答案是：<Text className="right">A,D</Text>
          </Text>
          <View className="analysis">解析</View>
          <View className="analysis-content">
            谨慎性原则是指在有不确定因素的情况下作出判
            断时,保持必要的谨慎,不抬高资产或收益,也不压
            低负债或费用。对于可能发生的损失和费用,应 当加以合理估计。
          </View>
          <View className="video-box">
            <Video
              className="video"
              controls
              src="http://video-qn.51miz.com/preview/video/00/00/11/28/V-112819-996834F7.mp4"
            />
          </View>
        </View> */}
      </View>
    );
  }
}
// pages/Test/oralHomeWork/index

export default CourseList;
