import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { format } from "@/utils/timeFormat.js";
import "./index.less";

const app = Taro.getApp();
class _C extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      myData: {},
      otherData: {}
    };
  }
  componentWillMount() {}
  componentDidMount() {
    //  console.log(app.globalData.userInfo.userid);
  }

  componentWillReceiveProps(nextProps) {
    let myQaObj = {}
    let otherQaObj = {}
    nextProps.QAList.map(i => {
      let key = i.id
      if (app.globalData.userInfo.userid && (app.globalData.userInfo.userid == i.qaownerId || app.globalData.userInfo.userid == i.submitorId)) {
        if(!myQaObj.hasOwnProperty(key)) {
          myQaObj[key] = i
          myQaObj[key].answerList = []
        }
        myQaObj[key].answerList.push({answer: i.answer, answerTime: i.answerTime})
      } else {
        if(!otherQaObj.hasOwnProperty(key)) {
          otherQaObj[key] = i
          otherQaObj[key].answerList = []
        }
        otherQaObj[key].answerList.push({answer: i.answer, answerTime: i.answerTime})
      }
    });
    this.setState({ myData: myQaObj, otherData: otherQaObj});
  }

  componentDidShow() {}

  componentDidHide() {}

  formatDate = val => {
    return val ? format(val, 'yyyy-MM-dd') : "";
  };

  render() {
    const { myData, otherData } = this.state;
    return (
      <View className='container'>
        <View className='panel'>
          <View className='title'>我的提问</View>
          <View className='content'>
            <View className='listBox'>
              {Object.keys(myData).map(key => {
                let item = myData[key]
                let answerList = myData[key].answerList
                return (
                  <View className='listItem'>
                    <View className='block'>
                      <Text className='left'>Q</Text>
                      <View className='right'>
                        <View className='question'>{item.question}</View>
                        <View className='time'>
                          {this.formatDate(item.submitTime)}
                        </View>
                      </View>
                    </View>
                    {item.answer ? (
                      answerList.map(answer => {
                        return (
                          <View className='block'>
                            <Text className='left aw-color'>A</Text>
                            <View className='right'>
                              <View className='answer'>{answer.answer}</View>
                              <View className='time'>
                                {this.formatDate(answer.answerTime)}
                              </View>
                            </View>
                          </View>
                        )
                      })
                    ) : (
                      ""
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View className='panel'>
          <View className='title'>其它提问</View>
          <View className='content'>
            <View className='listBox'>
              {Object.keys(otherData).map(key => {
                let item = otherData[key]
                let answerList = otherData[key].answerList
                return (
                  <View className='listItem'>
                    <View className='block'>
                      <Text className='left'>Q</Text>
                      <View className='right'>
                        <View className='question'>{item.question}</View>
                        <View className='time'>
                          {this.formatDate(item.submitTime)}
                        </View>
                      </View>
                    </View>
                    {item.answer ? (
                      answerList.map(answer => {
                        return (
                          <View className='block'>
                            <Text className='left aw-color'>A</Text>
                            <View className='right'>
                              <View className='answer'>{answer.answer}</View>
                              <View className='time'>
                                {this.formatDate(answer.answerTime)}
                              </View>
                            </View>
                          </View>
                        )
                      })
                    ) : (
                      ""
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default _C;
