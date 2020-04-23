import {
  Block,
  View,
  Text,
  ScrollView
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./live-room.less";
const app = Taro.getApp();
import MyLive from '@/components/liveRoom/live.jsx'
import MyRecord from '@/components/liveRoom/record.jsx'
import TabPanel from '@/components/liveRoom/tab-panel.jsx'
import ExerciseComponent from '@/components/select_title'
import fetch from "@/api/request";
//   @withWeapp("Page")
class LiveRoom extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      chatContent: "",
      //   serverPath: app.globalData.serverPath,
      liveState: 1, // 直播状态 1:License不足；2:直播未开始；8:该用户已被封，加入失败;9:视频第一次缓冲播放开始
      publicChatData: [],
      chatContentArr: [],
      subject: {}, // 科目测试信息
      showMain: true // 是否显示主面板
    }
  }
  componentWillMount = () => {
    let title = this.$router.params.title
    if(title){
      Taro.setNavigationBarTitle({
        title: title.substring(0, 9) + '...'
      });
    }
  };
  componentDidMount = () => {
  }
  componentWillUnmount = () => {
  }

  config = {
    navigationBarBackgroundColor: "#13C799",
    navigationBarTitleText: "直播间",
    navigationBarTextStyle: "white",
    navigationStyle: "default",
    backgroundTextStyle: "dark",
    backgroundColor: "#eeeeee",
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };

  activate = () => {
    console.log()
  }
  inactivate = () => {
    console.log()
  }
  prev = () => { // 上一题
    console.log('prev')
  }
  next = () => { // 下一题
    console.log('next')
  }
  submitPaper = () => { // 提交
    const isDone = false // 是否已做完
    const errMsg = isDone ? '' : '还有5题未作答，'
    Taro.showModal({
      title: '提示',
      content: '共20题，' + errMsg + '是否交卷？',
      showCancel: true,
      cancelText: isDone ? '检查' : '交卷',
      confirmText: isDone ? '交卷' : '继续作答',
      cancelColor: '#6C7179',
      confirmColor: '#00AB84',
      mask: true,
      success: (rs) => {
        if (rs.cancel) {
          isDone && console.log('检查')
          !isDone && console.log('交卷')
        } else if (rs.confirm) {
          isDone && console.log('交卷')
          !isDone && console.log('继续作答')
        }
      },
      fail: () => {
        console.log('fail')
      }
    })
  }

  render () {
    const options = this.$router.params;
    let { subject } = this.state
    let list = {
      isAfterClass: 0,
      topicType: 0,
      selectType: 0
    }
    const isLast = true
    return (
      <Block>
        <View className="pageContainer">
          <View className="video">
            {options.videoType == 1 ? <MyLive /> : <MyRecord options={options} />}
          </View>
          <View className="nav">
            <TabPanel videoType={options.videoType}></TabPanel>
            {/*<View className='practise'>
              <View className='head'>
                <View className='at-icon at-icon-chevron-left' onClick={this.showMain}></View>
                <View className='title'>课堂小练练习题1名称课堂小练练习题1名称课堂小练练习题1名称</View>
                <View className='count'>1<Text className='total'>/12</Text></View>
              </View>
              <View className='content'>
                <ScrollView scrollY style='height: 100%'>
                  <ExerciseComponent list={list}></ExerciseComponent>
                </ScrollView>
              </View>
              <View className='foot'>
                <Text onClick={this.prev}>上一题</Text>
                {!isLast ? <Text onClick={this.next}>下一题</Text> : <Text onClick={this.submitPaper}>提交</Text>}
              </View>
            </View>*/}
          </View>
        </View>
      </Block>
    );
  }
}

export default LiveRoom;
