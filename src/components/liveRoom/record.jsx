import { Block, Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import fetch from '@/api/request.js';

const app = Taro.getApp();
const VOD = require('@/utils/wxGssdk/vod/vod.js');
const GSSDK = require('@/utils/wxGssdk/vod/gssdk.js');

const GS = GSSDK.GS;

let oldCurrentTime = -1;
//   @withWeapp("Page")
class Record extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = {
      //   serverPath: app.globalData.serverPath,
      videoInit: {
        site: '',
        ownerid: '',
        ctx: 'webcast',
        uid: '',
        k: '',
        authcode: '',
        uname: '',
        encodetype: '',
        password: '',
        istest: true
      },
      liveState: 2, // 直播状态 1:License不足；2:直播未开始；8:该用户已被封，加入失败;9:视频第一次缓冲播放开始
      video: {
        videoSrc: '', //视频地址
        autoplay: true, //是否自动播放
        title: '',
        imgUrl: ''
      }
    };
  }
  componentWillMount = () => {
    this.channel = GS.createChannel();
    app.globalData.channel = this.channel;
  };
  componentDidMount = () => {
    const options = app.globalData.liveData;
    this.videoContext = Taro.createVideoContext('recordVideo');
    fetch('getReplayInfo', {
      SSOTOKEN: Taro.getStorageSync('token'),
      classplanLiveId: options.classplanLiveId
    }).then(res => {
      console.log(res);
      if (res) {
        this.setState(
          {
            videoInit: {
              site: res.genseeDomainName,
              ownerid: res.vodId,
              uid: res.uid,
              //考勤 -- 20200321
              uname: res.nickname,
              k: res.k
            }
          },
          () => {
            this.init();
          }
        );
      }
    });
  };

  componentWillUnmount = () => {
    VOD._open_.refresh();
  };
  init = () => {
    let _this = this;
    const { videoInit } = _this.state;
    console.log('videoInit.ownerid', videoInit.ownerid);
    /*const test = {
        site: "hqyzx.gensee.com",
        ownerid: "63accef6c2cb421e95372bba38ee442d",
        ctx: "webcast",
        authcode: "",
        uid: "14598321",
        uname: "",
        encodetype: "",
        password: "",
        k: "f2e731f9d4e666a3e48a76e3947f40cb",
        istest: true
      }*/

    VOD._open_.init(
      {
        widget: this.channel,
        site: videoInit.site,
        ownerid: videoInit.ownerid,
        ctx: videoInit.ctx,
        authcode: videoInit.authcode,
        uid: videoInit.uid,
        uname: videoInit.uname,
        encodetype: videoInit.encodetype,
        password: videoInit.password,
        k: videoInit.k
      },
      function(e) {
        console.log('初始化成功');
        console.log(e);
        app.globalData.userInfo.userid = e.userid;
      }
    );

    //视频URL
    this.channel.bind('onVideoUrl', function(e) {
      console.log('onVideoUrl', e);
      _this.setState({
        video: {
          videoSrc: e.data.mediaUrl
        }
      });
      // 视频地址暂时替换
    });
    /**
     * SDK状态通知
     * @param type 1:License不足；2:直播未开始；8:该用户已被封，加入失败;9:视频第一次缓冲播放开始
     */
    this.channel.bind('onStatus', function(e) {
      _this.setState({
        liveState: e.data.type
      });
    });

    //SDK加载完毕，所有API生效
    this.channel.bind('onDataReady', function(e) {
      console.log('SDK加载完毕，所有API生效');
      _this.channel.send('setupChatSync', { open: true });
      _this.channel.send('submitQAList', {});
      _this.channel.send('submitChatHistory', {});
      _this.videoContext.play();
      // console.log(e);
    });

    //API错误通知
    this.channel.bind('onAPIError', function(e) {
      console.log(e.type + '错误：' + e.data.explain);
      Taro.showToast({
        title: '播放出错啦',
        icon: 'none'
      });
    });
  };

  config = {
    navigationBarBackgroundColor: '#00AB84',
    navigationBarTitleText: '密训小程序',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default',
    backgroundTextStyle: 'dark',
    backgroundColor: '#eeeeee',
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };
  playVideo = e => {
    const options = app.globalData.liveData;
    fetch('unlockHomeWork', {
      classplanLiveId: options.classplanLiveId,
      classPlanId: options.classplanId,
      SSOTOKEN: Taro.getStorageSync('token')
    }).then(res => {
      console.log(res);
    });
    VOD.initMediaEvent.play();
    VOD.initMediaEvent.playing();
  };
  pauseVideo = e => {
    VOD.initMediaEvent.pause();
  };
  endVideo = e => {
    VOD.initMediaEvent.ended();
  };
  timeupdate = event => {
    if (event.detail.currentTime != oldCurrentTime) {
      app.globalData.currentTime = event.detail.currentTime;
      VOD.initMediaEvent.timeRecord();
      if (Math.abs(event.detail.currentTime - oldCurrentTime) > 1) {
        VOD.initMediaEvent.timeupdate();
        VOD.initMediaEvent.seeking();
        VOD.initMediaEvent.seeked();
      }
      oldCurrentTime = event.detail.currentTime;
    }
  };
  upper = e => {};
  lower = e => {};
  scroll = e => {};
  render() {
    const { video } = this.state;

    return (
      <Block>
        <Video
          id='recordVideo'
          src={video.videoSrc}
          className='myVideo'
          autoplay
          onTimeUpdate={this.timeupdate}
          onPlay={this.playVideo}
          onPause={this.pauseVideo}
          onEnded={this.endVideo}
          style='width: 100vw;height: 421rpx'
        />
      </Block>
    );
  }
}

export default Record;
