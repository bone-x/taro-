import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button, ScrollView, Progress } from '@tarojs/components';
import { AtFloatLayout } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { format } from '@/utils/timeFormat'
import { addSectionList } from "../../actions/course";
import fetch from '@/api/request.js'
const app = Taro.getApp();
import './task.less'
import style from "../note/index.module.less";

@connect(state => state.course, {addSectionList})
class _C extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dwProgress: 0, //下载进度
      showProgress: false,
      isopen: false, // 是否展开/折叠
      showNote: false, // 打开笔记列表
      noteList: [] // 考霸笔记列表
    }
  }

  componentDidMount() {
    let {open} = this.props
    this.setState({
      isopen: open || false,
      liveState: { // 直播状态
        0:'直播未开始',
        1: '正在直播',
        2: '直播已结束'
      }
    })
  }
  componentWillReceiveProps() {
  }

  componentDidShow() {}

  componentDidHide() {}

  toggle = (index) => {
    const { isopen } = this.state
    this.props.onOpen(index)
    this.setState({
      isopen: !isopen
    })
  }

  handleClose = () => {
    this.setState({
      showNote: false
    })
  }

  // 查看笔记
   showNote = async () => {
    // 考霸笔记
    let {course, addStarNum } = this.props
    let param = {
      trainId: course.trainId,
      courseId: course.courseId
    }

    if (course.starNum < 3) {
      const res = await fetch('unLockLessonsStatus', {trainId: course.trainId, classplanId:course.classplanId})
      res && addStarNum(course.index - 1, 'noteLock')
    }
    fetch('getNoteList', param).then(res => {
      this.setState({
        showNote: true,
        noteList: res
      })
    })
  }

  // 下载考霸笔记
  downloadNote = (url) => {
    // url = 'https://goss.veer.com/creative/vcg/veer/800water/veer-164919552.jpg'
    Taro.showModal({
      title: '提示',
      content: '是否下载该笔记？',
      confirmColor: '#00AB84',
      mask: true,
      success: (rs) => {
         if(rs.confirm) {
           this.downloadFile(url)
        }
      },
    })
  }
  downloadFile = (url) => {
    // url = 'http://s3.pfp.sina.net/ea/ad/6/12/83980637b34a3168345ffa4b241cf3a6.jpg'
    Taro.showLoading({
      title: '文件读取中…'
    })
    console.log('url',url)
    Taro.downloadFile({
      url: url,
      // filePath: 'hq',
      filePath: '',
      complete: () =>　Taro.hideLoading(),
      fail: () =>{
        Taro.showToast({
          title: '下载失败',
          mask: true,
          icon: 'none'
        })
      },
      success: (res) => {
        console.log('res', res)
        Taro.openDocument({
          filePath: res.tempFilePath,
          success: (ress)=>{
            console.log('saveFile', ress)
          }
        }).catch(() => {
          Taro.showToast({
            title: '打开文件失败，不支持的文件格式',
            mask: true,
            icon: 'none'
          })
        })
      }
    })
  }

  showCourseToast = (workLock) => {
    !workLock && Taro.showToast({
      title: '请观看课程视频后解锁',
      icon: 'none'
    })
  }

  showNoteToast = (noteLock) => {
    !noteLock && Taro.showToast({
      title: '请完成课后作业正确率达到90%以上',
      icon: 'none'
    })
  }

  // 数字转大写
  numberFormat = (val) => {
    val = val || 1
    const chinessNum = ['一二三四五六七八九', '十']
    let tempStr = String(val).split('').reverse()
    let rs = tempStr.map((item, index) => {
      return (index > 0 && item > 1) ? [chinessNum[0].charAt(item - 1), chinessNum[index]].join('') : chinessNum[index].charAt(item - 1)
    })
    return rs.reverse().join('')
  }

  // 查看报告
  viewReport = () => {
    const { course = {} } = this.props;
    let url = '/pages/studyReport/report-'+ (course.starNum >= 3 ? 'finished' : 'unfinished')
    Taro.navigateTo({url: url + '?trainType='+(app.globalData.courseAllDone?0:1)})
    this.props.addSectionList(course)
  }

  //课后作业——开始做题
  startExercise = () => {
    const {course} = this.props
    app.globalData.trainId = course.trainId
    console.log('app.globalData.trainId', course.trainId)
    Taro.navigateTo({
      url: '/pages/Test/classHomeWork/index?sectionCode='+course.trainNo
    })
  }


  // 获取直播时间
  getTimeRange = () => {
    const { course } = this.props;
    if(course && course.startTime) {
      let timeStr = format(course.startTime, 'yyyy.MM.dd')
      timeStr += ` (${format(course.startTime, 'hh:mm')}-${format(course.endTime, 'hh:mm')})`
      return timeStr
    } else {
      return ''
    }
  }

  // 跳转至直播/录播
  goToLive = () => {
    let course = this.props.course
    const {liveFlag, enterFlag, backUrl, index, title} = course
    let url = '/liveRoom/pages/liveHome/live-room?title=任务' + this.numberFormat(index) + title
    if(liveFlag == 0) {
      return Taro.showToast({
        title: '直播还没开始，敬请留意',
        icon: 'none'
      })
    } else if(liveFlag == 1) { // 直播
      url += '&videoType=1'
      if(enterFlag == 1){
        return Taro.showToast({
          title: '直播正在准备中，现在还不能进入直播室哦',
          icon: 'none'
        })
      }
    } else { // 录播
      url += '&videoType=2'
    }

    if(liveFlag == 2 && !backUrl) {
      return Taro.showToast({
        title: '直播视频还未上传，敬请留意',
        icon: 'none'
      })
    }

    app.globalData.liveData = course
    Taro.navigateTo({
      url: url
    })
  }

  render() {
    const star = <Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png'></Image>
    const starNon = <Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star-non.png'></Image>
    const lock = <Image className='lock' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/lock.png'></Image>
    const { isopen, showNote, liveState, noteList, dwProgress, showProgress } = this.state;
    const { state, course = {} } = this.props;
    const height = isopen?'auto':0
    const starCount = [1,2,3]
    course.workStatus = 0 //目前先定死只有开始做题
    return (
      <View className='panel'>
        <View className='panel-top' onClick={() => this.toggle(course.index)}>
          <View className='prefix'></View>
          <View className='block'>
            <View className='block-left'>
              {
                isopen?
                  (<View>任务{this.numberFormat(course.index)}：{course.title.slice(course.title.indexOf('节')+1)}</View>)
                  : (
                    <View>
                      <Text className='stageName'>任务{this.numberFormat(course.index)}</Text>
                      {starCount.map(val => course.starNum >= val ? <Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png'></Image> :
                        <Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star-non.png'></Image>)}
                      <View className='timeMsg'>{this.getTimeRange()}</View>
                    </View>
                  )
              }
            </View>
            <View className='block-right'>
              <Image className='img' src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/arrow-${isopen?'up':'down'}.png`}></Image>
            </View>
          </View>
        </View>
        <View className='panel-content' style={`height:${height}`}>
          <View className='timeline' refs='timeline'>
            <View className={['tl-item',course.starNum >= 1 ?'mainColor':''].join(' ')} onClick={this.goToLive}>
              <View className='tl-item__tail'></View>
              <View className='tl-item__icon'></View>
              <View className='tl-item__content'>
                <View className='box'>
                  <View className='top'>
                    {course.starNum > 0 ? star : starNon}
                    <Text className='text'>观看直播</Text>
                  </View>
                  <View className='course-msg'>
                    <Text className='time'>{this.getTimeRange()}</Text>
                    <Text className='state'>{liveState[course.liveFlag]}</Text>
                  </View>
                  <View className='video'>
                    <Image className='img' mode='aspectFill' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/webcast.png'></Image>
                    <View className='view'><Image className='play_img' src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/${course.liveFlag !==1?'play.png':'live.gif'}`}/></View>
                  </View>
                </View>
              </View>
            </View>
            <View className={['tl-item',course.workLock ?'mainColor':''].join(' ')} onClick={() => this.showCourseToast(course.workLock)}>
              <View className='tl-item__tail'></View>
              <View className='tl-item__icon'></View>
              <View className='tl-item__content h-118 flex'>
                <View className='con'>
                  <View className='con-left'>
                    <View>
                      {course.starNum >= 2?star:starNon}
                      <Text>课后作业</Text>
                    </View>
                    <View className='desc'>{course.workLock? '':'观看视频即可解锁'}</View>
                  </View>
                  <View className='con-right'>
                    {course.workLock? (
                      <Button className={['opt', course.workStatus == 0? '':'lightColor'].join(' ')} onClick={this.startExercise}>{course.workStatus == 0? '开始做题':'继续做题'}</Button>
                    ): <View>{lock}</View>}
                  </View>
                </View>
              </View>
            </View>
            <View className={['tl-item',course.noteLock && course.starNum >= 2 ?'mainColor':''].join(' ')}  onClick={() => this.showNoteToast(course.noteLock)}>
              <View className='tl-item__tail'></View>
              <View className='tl-item__icon'></View>
              <View className='tl-item__content h-118 flex'>
                <View className='con'>
                  <View className='con-left'>
                    <View>
                      {course.starNum >= 3?star:starNon}
                      <Text>考霸笔记</Text>
                    </View>
                    <View className='desc'>{state?'':'作业正确90%即可解锁'}</View>
                  </View>
                  <View className='con-right'>
                    {course.noteLock? (
                      <Button className='opt' onClick={this.showNote}>查看笔记</Button>
                    ): <View>{lock}</View>}
                  </View>
                </View>
              </View>
            </View>
          </View>
          {
            course.starNum > 0 && <View className='view-report' onClick={() => this.viewReport()}><Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/report_view.png'></Image>查看报告</View>
          }
        </View>
        <AtFloatLayout isOpened={showNote} onClose={() => this.handleClose()}>
          <View className='showNote_header'>
            <View className='title'>考霸笔记</View>
            <View
              onClick={this.handleClose}
            >
              <Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/close.png'></Image>
            </View>
          </View>
          <View className='noteList'>
            {showProgress && <View className='dwProgress'><Progress percent={dwProgress} showInfo strokeWidth={4} /></View>}
            {noteList.length == 0 && <Image
              className='noteEmpty'
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/empty.png'
            />}
            {
              noteList.map(item =>{
                return  (
                  <View className='noteItem' onClick={() => this.downloadFile(item.fileUrl)}>
                    <Image className='img' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/pdf.png'></Image>
                    <Text>{item.fileName}</Text>
                  </View>
                )
              })
            }
          </View>
        </AtFloatLayout>
      </View>
    );
  }
}

export default _C;
