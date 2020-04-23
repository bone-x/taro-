import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  ScrollView,
  Input,
  Button
} from "@tarojs/components";
import "./tab.less";
import Qa from "../qa/index.jsx";
import Note from "../note";
import Exercise from "../exercise";
const app = Taro.getApp();
class _C extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      chatArr: [],
      chatContentArr: [],
      myData: [],
      otherData: [],
      QAList: [
        // {
        //   id: "abcd-efg-hi",
        //   question: "么么哒?",
        //   submitor: "Tom",
        //   answer: "fine, thank you.",
        //   answerBy: "Jack",
        //   submitTime: 9654123,
        //   answerTime: 8795623,
        //   qaownerId: 15516723
        // },
        // {
        //   id: "abcd-efg-hi",
        //   question: "么么哒1?",
        //   submitor: "Tom",
        //   answer: "fine, thank you.",
        //   answerBy: "Jack",
        //   submitTime: 9654123,
        //   answerTime: 8795623,
        //   qaownerId: 15516723
        // },
        // {
        //   id: "abcd-efg-hi",
        //   question: "how are you?",
        //   submitor: "Tom",
        //   answer: "fine, thank you.",
        //   answerBy: "Jack",
        //   submitTime: 9654123,
        //   answerTime: 8795623,
        //   qaownerId: 8735462541
        // }
      ],
      chatContent: "",
      height: 0,
      scrollTop: 0,
      activePanel: "chat"
    };
  }

  componentDidMount() {
    var _this = this;
    app.globalData.channel.bind("onPublicChat", function(e) {
      console.log("收到公聊消息",e);
      for (var i = 0; i < e.data.length; i++) {
        _this.state.chatArr.push(e.data[i]);
      }
      _this.setState({
        chatContentArr: _this.state.chatArr,
        scrollTop: _this.state.chatContentArr.length * 100
      });
    });
    app.globalData.channel.bind("onChatHistory", function(e) {
      console.log("历史聊天消息",e);
      for (var i = 0; i < e.data.list.length; i++) {
        _this.state.chatArr.push(e.data.list[i]);
      }
      _this.setState({
        chatContentArr: _this.state.chatArr,
        scrollTop: _this.state.chatContentArr.length * 100
      });

      /*let hasMore = e.data.more
      if(hasMore) { // 加载更多历史聊天
        setTimeout(() => {
          app.globalData.channel.send("submitChatHistory", {})
        }, 1000)
      }*/
    });

    app.globalData.channel.bind("onQAList", function(e) {
      console.log("获取问答列表", e);
      let qalist = []
      e.data.list.map(item => {
        item.answerTime = parseInt(item.answerTime) * 1000
        item.submitTime = parseInt(item.submitTime) * 1000
        qalist.push(item)
      })
      _this.setState({
        QAList: qalist
      });
    });

    app.globalData.channel.bind('onQA', function(e){
      console.log('收到问答',e.data)
      e.data.answerTime = parseInt(e.data.answerTime) * 1000
      e.data.submitTime = parseInt(e.data.submitTime) * 1000
      let { QAList } = _this.state
      QAList.push(e.data)
      _this.setState({
        QAList: QAList
      });
    })
  }
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidShow() {}

  componentDidHide() {}
  scrollMsgBottom = () => {
    const query = Taro.createSelectorQuery();
    query.select(".scrollView").boundingClientRect();
    query.select(".panel-active").boundingClientRect();
    query.select(".fixBottom").boundingClientRect();
    query.exec(res => {
      console.log(res, 123);
      const scrollTop = res[1].height - res[0].height + res[2].height * 2.35;
      this.setState({
        scrollTop: scrollTop > 0 ? scrollTop : 0
      });
    });
  };

  handleClick = value => {
    console.log(value);
    this.setState({
      activePanel: value
    });
  };
  handleChange = e => {
    var { value, height } = e.detail;
    console.log("value", value);
    this.setState({
      chatContent: value
    });
  };
  inputFocus = e => {
    var { height } = e.detail;
    console.log(height);

    this.setState({
      height
    });
  };
  inputBlur = e => {
    this.setState({
      height: 0
    });
  };
  submit = e => {
    let { chatContentArr, chatContent, activePanel, QAList } = this.state;
    if (chatContent == "" || chatContent.trim().length == 0) {
      return false;
    }
    if (activePanel == "chat") {
      // 发送聊天信息
      chatContentArr.push({
        sender: app.globalData.nickName,
        content: chatContent
      });
      app.globalData.channel.send("submitChat", { content: chatContent });
      this.setState({
        chatContentArr: chatContentArr,
        scrollTop: this.state.chatContentArr.length * 100,
        chatContent: ""
      });
      // this.scrollMsgBottom();
    } else {
      // 发送提问
      // QAList.push({ question: chatContent, submitTime:timestamp});
      app.globalData.channel.send("submitQuestion ", {
        content: chatContent
      },function(e){
        console.log('提问回调', e)
      });

      this.setState({
        // QAList: QAList,
        chatContent: ""
      });
      // this.scrollMsgBottom();
    }
  };

  setActive = activePanel => {
    return activePanel == this.state.activePanel
      ? "panel-active"
      : "panel-inactive";
  };

  render() {
    const {videoType} = this.props
    const tabList = [
      // { title: "文档", name: "doc", type: 1 },
      { title: "聊天室", name: "chat", type: 1 },
      { title: "笔记", name: "note", type: 1 },
      { title: "问答", name: "qa", type: 1 }
      // { title: "练习题", name: "exercise", type: 2}
    ];
    // const curTablist = tabList.filter(item => item.type == 1)
    const {
      height,
      scrollTop,
      activePanel,
      chatContentArr,
      QAList
    } = this.state;

    const teacherIcon = (
      <Image src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/teacher_icon.png" />
    );
    const stuentIcon = (
      <Image src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/student_icon.png" />
    );
    const teacherTag = ["1", "2", "4", "1,2", "2,4", "1,2,4"];
    const style = `bottom: ${height}px`;
    return (
      <View className="tab-box">
        <View className="tab-header">
          {tabList.map((item, index) => {
            return (
              <View
                className={[
                  "tab-item",
                  activePanel == item.name ? "tab-item__active" : ""
                ].join(" ")}
                onClick={() => {
                  this.handleClick(item.name);
                }}
              >
                <View className="name">
                  {item.title}
                  <View className="tab-underline"></View>
                </View>
              </View>
            );
          })}
        </View>
        <View className="tab-panel">
          <ScrollView
            className="scrollView"
            scrollTop={scrollTop}
            scrollY
            style="height: 100%;"
          >
            <View className={this.setActive("chat")}>
              <View className="chat-box">
                {chatContentArr.map(item => {
                  let isTeacher = teacherTag.includes(item.sendRole);
                  return (
                    <View className="chat">
                      <View className="chat-people">
                        {isTeacher ? teacherIcon : stuentIcon}
                      </View>
                      <View className="desc">
                        <View className="name-time-box color-2">
                          <Text>{item.sender}</Text>
                        </View>
                        <View className="pr">
                          <View
                            className={[
                              "chat-text",
                              isTeacher ? " bg-1" : " bg-2"
                            ].join(" ")}
                          >
                            <Text className="text">{item.content}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View className={this.setActive("qa")}>
              <Qa QAList={QAList}></Qa>
            </View>
            <View className={this.setActive("note")}>
              <Note isActive={activePanel == "note"}></Note>
            </View>
            <View className={this.setActive("exercise")}>
              <Exercise></Exercise>
            </View>
            <View className={activePanel ? "fixBottom" : ""}>
              {videoType == 1 && (activePanel == "chat" || activePanel == "qa") && (
                <View className="submitBox" style={style}>
                  <Input
                    adjust-position={false}
                    className="conInput"
                    type="text"
                    placeholder="说点什么吧"
                    value={this.state.chatContent}
                    onInput={e => {
                      this.handleChange(e);
                    }}
                    onFocus={e => {
                      this.inputFocus(e);
                    }}
                    onBlur={e => {
                      this.inputBlur(e);
                    }}
                  />
                  <Button className="submit" onClick={this.submit}>
                    发送
                  </Button>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default _C;
