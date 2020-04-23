import { Block, Video, View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
const app = Taro.getApp();
import style from './live.module.less'
const LIVE = require("@/utils/wxGssdk/live/live.js");
const GSSDK = require("@/utils/wxGssdk/live/gssdk.js");
const GS = GSSDK.GS;
import fetch from '@/api/request.js'
class Live extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      chatContentArr: [],
      publicChatData: [],
      dataArray: [],
      videoInit: {
        site: "",
        ownerid: "",
        ctx: "webcast",
        authcode: "",
        uid: "",
        uname: "",
        encodetype: "",
        password: "",
        stream: 1, //设置移动端初始化码流。值为：0 – 标清，1 – 原始。默认为1。
        k: ""
      },
      nickName: '',
      playStatus: "未开始",//当前状态
      playNum: 0,//当前人数
      isFullScreen: false,
      liveState: 2, // 直播状态 1:License不足；2:直播未开始；8:该用户已被封，加入失败;9:视频第一次缓冲播放开始
      video: {
        videoSrc: "", //视频地址
        autoplay: true, //是否自动播放
        title: "",
        imgUrl: ""
      },
    }
  }
  componentWillMount = () => {
    this.channel = GS.createChannel();
    app.globalData.channel = this.channel;
  };
  componentDidMount = () => {
    const options = app.globalData.liveData;
    this.videoContext = Taro.createVideoContext('liveVideo')
    fetch('getLiveInfo', {
      token: Taro.getStorageSync("token"),
      classplanLiveId: options.classplanLiveId,
      clientType: 'ios',
      appVersion: 450
    }).then(res => {
      this.setState({
        videoInit: {
          site: res.genseeDomainName,
          ownerid: res.genseeLiveId,
          uid: res.uid,
          username: res.nickname,
          k: res.k
        },
        nickName: res.nickname
      }, () => {
        this.init();
      })
    }).catch(err => console.log(err));
  };
  init = () => {
    app.globalData.nickName = this.state.nickName;
    let _this = this
    LIVE.init(
      {
        site: _this.state.videoInit.site,
        ownerid: _this.state.videoInit.ownerid,
        ctx: _this.state.videoInit.ctx,
        authcode: _this.state.videoInit.authcode,
        uid: _this.state.videoInit.uid,
        uname: _this.state.videoInit.username,
        encodetype: _this.state.videoInit.encodetype,
        password: _this.state.videoInit.password,
        stream: _this.state.videoInit.stream,
        k: _this.state.videoInit.k
      }, function (e) {
        console.log("初始化成功");
        // console.log(e);
        app.globalData.userInfo.userid = e.userid;
      })

      //视频URL
      this.channel.bind("onVideoUrl", function (e) {
        console.log('onVideoUrl', e)
        _this.setState({
          video: {
            videoSrc: e.data
          }
        })
      });
      /**
       * SDK状态通知
       * @param type 1:License不足；2:直播未开始；8:该用户已被封，加入失败;9:视频第一次缓冲播放开始
       */
      this.channel.bind("onStatus", function (e) {
        console.log('SDK状态通知', e.data)
        if (e.data.type == 2) {
          Taro.showToast({
            title: e.data.explain,
            icon: 'none'
          })
        }
        _this.setState({
          liveState: e.data.type
        })
      });

    //SDK加载完毕，所有API生效
    this.channel.bind("onDataReady", function (e) {
      console.log("SDK加载完毕，所有API生效");
    });

    //API错误通知
    this.channel.bind("onAPIError", function (e) {
      Taro.showToast({
        title: e.data.explain,
        icon: 'none'
      })
      console.log(e.type + "错误：" + e.data.explain);
    });
    //在线人数
    this.channel.bind("onUserOnline", function (e) {
      console.log("在线人数");
      var count = e.data.count;
      _this.setState({
        playNum: count
      });
    });
    //直播状态
    this.channel.bind("onStart", function () {
      _this.setState({
        playStatus: '直播中'
      });
      _this.videoContext.play();
    });
    this.channel.bind("onPause", function () {
      _this.setState({
        playStatus: '已暂停'
      });
      _this.videoContext.play();
    });
    this.channel.bind("onPlay", function () {
      _this.setState({
        playStatus: '直播中'
      });
      _this.videoContext.play();
    });
    this.channel.bind("onStop", function () {
      _this.setState({
        playStatus: '已结束',
        video: {
          videoSrc: ''
        }
      });
    });

  }
  changeScreen = () => {
    const { isFullScreen } = this.state
    // if (showVideo) {
    console.log('this.videoContext.requestFullScreen', this.videoContext.requestFullScreen)
    this.videoContext.requestFullScreen({direction: -90})
    return this.videoContext.requestFullScreen({direction: -90})
    if (isFullScreen) {
      this.videoContext.exitFullScreen();
    } else {
      this.videoContext.requestFullScreen({direction: 90});
      console.log(this.videoContext.requestFullScreen)
    }
    this.setState({
      isFullScreen: !isFullScreen
    })

    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '直播未开始，不可切换',
    //     showCancel: false,
    //     confirmText: '我知道了',
    //     confirmColor: '#0078d7'
    //   });
    // }


  }
  componentWillUnmount = () => {
    LIVE.refresh();
  };
  config = {
    navigationBarBackgroundColor: "#13C799",
    navigationBarTitleText: "密训小程序",
    navigationBarTextStyle: "black",
    navigationStyle: "default",
    backgroundTextStyle: "dark",
    backgroundColor: "#eeeeee",
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };
  playVideo = e => {
    const options = app.globalData.liveData
    fetch('unlockHomeWork', {
      classplanLiveId: options.classplanLiveId,
      classPlanId: options.classplanId,
      SSOTOKEN: Taro.getStorageSync('token')
    }).then(res => {
      console.log(res)
    })
    LIVE.toldPlay();
    LIVE.initBindPlaying();
    LIVE.initBindPlay();
  };
  pauseVideo = e => {
    LIVE.initBindPause();
  };
  waitVideo = e => {
    LIVE.initBindWaiting()
  };
  endVideo = e => {
    LIVE.initBindEnded();
  };
  timeupdate = e => {
    app.globalData.currentTime = e.detail.currentTime;
  };
  upper = e => { };
  lower = e => { };
  scroll = e => { };
  render () {
    const {
      video,
      playStatus,
      playNum
    } = this.state;
    return (
      // <View className={style.live_video}>
      <Block>
        <Video
          id='liveVideo'
          src={video.videoSrc}
          className={style.video}
          autoplay
          onTimeUpdate={this.timeupdate}
          onPlay={this.playVideo}
          onPause={this.pauseVideo}
          onWaiting={this.waitVideo}
          onEnded={this.endVideo}
        />
        {/*<View className={style.banner}>
          <View className={style.left}>
            <View className={style.left_top}>
              <View className={style.play_ball}></View>
              <Text className={style.text}>{playStatus}</Text>
            </View>
            <View className={style.left_bottom}>
              <Image className={style.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/numWhite.png' />
              <Text className={style.text}>{playNum}</Text>
            </View>
          </View>
          <View className={style.right} onClick={this.changeScreen}>
            <Image className={style.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/fullScreen.png'></Image>
          </View>
        </View>*/}
      </Block>
    );
  }
}

export default Live;
