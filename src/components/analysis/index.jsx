import Taro, { Component } from "@tarojs/taro";
import { View, Text, RichText, Image } from "@tarojs/components";

import "./index.less";

class CourseList extends Component {
  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  goLookAnalysis = val => {
    Taro.navigateTo({
      url: `/pages/videoParsing/index?VID=${val}`
    });
  };

  render() {
    const { item } = this.props;

    return (
      <View className='exercise-list'>
        <View className='topic-title'>
          <RichText nodes={item.subjectName} />
        </View>
        <View className='topic-answer-box'>
          {item
            ? item.subjectAnswerList.map(k => {
                return (
                  <View
                    className={
                      item.subjectTypeId === 2?
                      item.examRecordDetail?item.examRecordDetail.userAnswer.search(k.subjectOption) != -1?item.subjectAnswer.search(k.subjectOption) != -1?"topic-answer-y":"topic-answer-error":"topic-answer-n":"topic-answer-n"
                      //  item.examRecordDetail && item.subjectAnswer.search(k.subjectOption) != -1 && item.subjectAnswer.search(item.examRecordDetail.userAnswer) != -1
                      //     ? "topic-answer-y"
                      //     : item.examRecordDetail && !(item.subjectAnswer.search(item.examRecordDetail.userAnswer) != -1) && !(item.subjectAnswer.search(item.examRecordDetail.userAnswer) != -1)? "":"topic-answer-error"
                        :item.examRecordDetail? item.examRecordDetail.userAnswer === k.subjectOption? item.subjectAnswer.search(item.examRecordDetail.userAnswer) != -1? "topic-answer-y": "topic-answer-error": "topic-answer-n":"topic-answer-n"
                    }
                    key={k.id}
                  >
                    <Text
                      style={
                        item.subjectTypeId === 1 || item.subjectTypeId === 3
                          ? "display: inline-block"
                          : "display: none"
                      }
                      className={
                        item.examRecordDetail? item.examRecordDetail.userAnswer === k.subjectOption? item.subjectAnswer.search(item.examRecordDetail.userAnswer) != -1? "topic-order-sheet-y": "topic-order-sheet-error": "topic-order-sheet-n":"topic-order-sheet-n"
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
                        item.examRecordDetail?item.examRecordDetail.userAnswer.search(k.subjectOption) != -1?item.subjectAnswer.search(k.subjectOption) != -1?"topic-order-multi-y":"topic-order-multi-error":"topic-order-multi-n":"topic-order-multi-n"
                      }
                    >
                      {k.subjectOption}
                    </Text>
                    {/* <Text className='answer-content'>{k.memo}</Text> */}
                    <View className='answer-content'>
                      <RichText nodes={k.memo} />
                    </View>
                  </View>
                );
              })
            : ""}
        </View>
        <View
          className='answer-box'
        >
          <Image
            className='right-img'
            src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/${
              item.examRecordDetail&&item.examRecordDetail.isTrue ? "report/right" : "wrong"
            }.png`}
          />
          <Text>
            {`${item.examRecordDetail&&item.examRecordDetail.isTrue ? "答对了" : "答错了"}，正确答案是：`}
            <Text className='right'>{item.subjectAnswer}</Text>
          </Text>
          <View className='analysis'>解析</View>
          <View className='analysis-content'>
            <RichText nodes={item.subjectAnalysis} />
          </View>
          <View
            className='look-video'
            style={
              item && item.subjectVideo !== ""
                ? "display: block"
                : "display:none"
            }
          >
            <Text
              onClick={this.goLookAnalysis.bind(this, item.subjectVideo)}
              className='look-video-btn'
            >
              查看视频解析
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default CourseList;
