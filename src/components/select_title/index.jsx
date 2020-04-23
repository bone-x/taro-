import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText } from "@tarojs/components";
import fetch from "@/api/request.js";

import "./index.less";

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
      currIndex: []
    };
  }

  componentDidMount() {
    this.setState({
      typeList: this.props.list
    });
  }

  componentWillReceiveProps(nextProps) {
    let { arr } = this.state;
    let res = arr.filter(item => item != "");
    if (res.length > 0) {
      return false;
    } else {
      nextProps.allList.subjectVOList.map(item => {
        if (item.examRecordDetail) {
          arr.push(item.examRecordDetail.userAnswer);
        } else {
          arr.push("");
        }
      });
      // arr = new Array(nextProps.allList.subjectVOList.length).fill('')
      this.setState({ arr, currIndex: arr, answerList: nextProps.allList });
    }
  }

  lookBtnClick() {
    this.setState({
      answerShow: !this.state.answerShow
    });
  }

  topicAnswerclick(item) {
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
        arr: arr
      });
    } else if (this.props.item.subjectTypeId === 2) {
      // 多选
      let { currIndex } = this.state;
      // currIndex[this.props.curr]+=item.subjectOption
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
        this.props.item.subjectAnswer.search(item.subjectOption) != -1
          ? true
          : false;
    }

    const { answerList } = this.state;

    let params = {
      isTrue: isTrue,
      recordId: answerList.recordId,
      subjectId: item.subjectId,
      subjectTypeId: this.props.item.subjectTypeId,
      userAnswer: this.state.arr[this.props.curr]
        .split(",")
        .sort()
        .join(","),
      subjectAnswer: this.props.item.subjectAnswer,
      subjectSore: this.props.item.subjectSore,
      isRedo: false
    };

    fetch("doExamSubject", params).then(res => {
      console.log(res);
    });
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
      </View>
    );
  }
}

export default CourseList;
