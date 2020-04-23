import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtFloatLayout } from 'taro-ui'
import classNames from 'classnames'
import fetch from '@/api/request.js'
import style from "./report-unfinished.module.less";
import { connect } from '@tarojs/redux'

const app = Taro.getApp();
@connect(state => state.course)
class ReportUnfinished extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      status: 0, //0:任务未完成 1:课程未完成
      showNote:false,
      list: [
        {
          id: 0,
          title: "观看视频",
          info: "",
          type: 0,
          url:"/liveRoom/pages/liveHome/live-room"
        },
        {
          id: 1,
          title: "课后作业",
          info: "观看视频后解锁",
          type: 1,
          url:"/pages/Test/classHomeWork/index"
        },
        {
          id: 2,
          title: "考霸笔记",
          info: "作业正确90%即可解锁",
          type: 1,
          url:""
        }
      ],
      list2: [
        {
          id: 0,
          title: "阶段一 基础夯实"
        },
        {
          id: 1,
          title: "阶段二 系统学习"
        },
        {
          id: 2,
          title: "阶段三 系统回顾"
        }
      ],
      reportData:{
        // firstAnswerRightRatio:0,
        // answerRightRatio:0,
        // subjectCompletedNum:0,
        // knpMasterCount:0,
        // knpMasterRatio:0,
        // rank:0,
        // wrongAnsweredCount:0
      },
      duration:"0h",
      attendance:"0%",
      noteList:[],
      dwProgress: 0, //下载进度
      showProgress: false,
    };
  }
  config = {
    navigationBarTitleText: "任务报告",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white",
    navigationStyle: "default",
    backgroundTextStyle: "dark",
    backgroundColor: "#13C799",
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };
  componentWillMount() {
    // const id = this.$router.params.id;
    const query = this.$router.params;
    this.setState({
      status: query.trainType==1?0:1
    },()=>{
      Taro.setNavigationBarTitle({
        title: this.state.status == 1 ? "学习报告" : "课次报告"
      });
    })
    
  }
  componentDidMount() {
    console.log("props",this.props)
    if(this.state.status == 0){
      this.getSectionData();
      this.getSectionDuration();
    }else{
      this.getCourseData();
      this.getCourseDuration();
      this.getAttendance();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  // 课程报告数据
  getCourseData(){
    fetch("getCourseReport", {
      // courseCode: 'kckm620',
      courseCode: this.props.courseInfo.courseNo
    })
      .then((res) => {
        this.setState({reportData:res})
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 课次报告数据
  getSectionData(){
    fetch("getSectionReport", {
      // sectionCode: "kckm620Z01J01"
      sectionCode: this.props.sectionList.trainNo
    })
      .then((res) => {
        this.setState({reportData:res},()=>{this.handleSectionListStatus()})
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 课程听课时长
  getCourseDuration() {
    fetch("getCourseDuration", {
      courseId: this.props.courseDetail.courseId
    })
      .then((res) => {
        this.setState({duration:res.duration})
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 课次听课时长
  getSectionDuration() {
    fetch("getClassPlanLiveDuration", {
      classplanLiveId: this.props.sectionList.classplanLiveId
    })
      .then((res) => {
        this.setState({duration:res.duration})
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 出勤率
  getAttendance(){
    fetch("getAttendance", {
      courseId: this.props.courseDetail.courseId
      // courseId: "3049"
    })
      .then((res) => {
        this.setState({attendance:res.addtendance})
      })
      .catch(error => {
        console.log(error);
      });
  }
  // 课次任务状态
  handleSectionListStatus(){
    const sectionList = this.props.sectionList;
    console.log(sectionList)
    if(!sectionList.trainId){
      return
    }
    let  {list,reportData} = this.state;
    if(sectionList.workLock){
      list[1].type = 0
      if(reportData.answerRightRatio>0 && reportData.answerRightRatio<0.9){
        list[1].info = "作业正确率未达到90%"
      }else{
        list[1].info = ""
      }
    }
    if(sectionList.noteLock){
      list[2].type = 0;
      list[2].info = "";
    }
    this.setState({list})
  }
  // 课次任务跳转
  handleSectionRoute(data){
    if(data.id == 0){
      this.goToLive()
    }else if(data.id == 1 && data.type == 0){
      const course = this.props.sectionList
      app.globalData.trainId = course.trainId
      console.log('app.globalData.trainId', course.trainId)
      Taro.navigateTo({
        url: '/pages/Test/classHomeWork/index?sectionCode='+course.trainNo
      })
    }else if( data.id == 2 && data.type == 0){
      this.showNote();
    }
  }
  // 考霸笔记关闭
  handleClose = () => {
    this.setState({
      showNote: false
    })
  }

  // 查看笔记
  showNote = async () => {
    // 考霸笔记
    let course = this.props.sectionList
    let param = {
      trainId: course.trainId,
      courseId: course.courseId
    }

    if (course.starNum < 3) {
      const res = await fetch('unLockLessonsStatus', {trainId: course.trainId, classplanId:course.classplanId})
      // res && addStarNum(course.index - 1, 'noteLock')
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

  // 数字转大写
  numberFormatCh = (val) => {
    val = val || 1
    const chinessNum = ['一二三四五六七八九', '十']
    let tempStr = String(val).split('').reverse()
    let rs = tempStr.map((item, index) => {
      return (index > 0 && item > 1) ? [chinessNum[0].charAt(item - 1), chinessNum[index]].join('') : chinessNum[index].charAt(item - 1)
    })
    return rs.reverse().join('')
  }
  // 跳转至直播/录播
  goToLive = () => {
    let course = this.props.sectionList
    const {liveFlag, backUrl, index, title} = course
    let url = '/liveRoom/pages/liveHome/live-room?title=任务' + this.numberFormatCh(index) + title
    if(liveFlag == 0) {
      return Taro.showToast({
        title: '直播还没开始，敬请留意',
        icon: 'none'
      })
    } else if(liveFlag == 1) { // 直播
      url += '&videoType=1'
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
    const { status, list, showNote,reportData, duration,noteList,dwProgress,showProgress } = this.state;
    const {knpMasterRatio,answerRightRatio,knpMasterCount,firstAnswerRightRatio,rank,wrongAnsweredCount,subjectCompletedNum} = reportData;
    const {courseList,sectionList} = this.props;
    
    const numberFormat = (val) => {
      return parseInt(val) < 10 ? '0'+val: val
    }

    return (
      <View className={style.unfinished}>
        <View className={status == 0 ? `${style.header}` : `${style.header1}`}>
          <View className={style.header_h1}>
            {status == 0 ? "您还有任务尚未完成" : "您有课程阶段尚未完成"}
          </View>
          <View className={style.header_h2}>快去完成吧！</View>
        </View>
        <View className={style.content}>
          <View className={style.task1}>
            <View className={style.task1_top}>
              <View className={style.top_item}>
                知识点掌握度<Text>{knpMasterRatio?(knpMasterRatio*100).toFixed(0)+'%':"0%"}</Text>
              </View>
              <View className={style.top_item}>
                累计答题正确率<Text>{answerRightRatio?(answerRightRatio*100).toFixed(0)+"%":"0%"}</Text>
              </View>
              <View className={style.top_item}>
                掌握知识点数<Text>{knpMasterCount?knpMasterCount:0}</Text>
              </View>
              <View className={style.top_item}>
                首次答题正确率<Text>{firstAnswerRightRatio?(firstAnswerRightRatio*100).toFixed(0)+"%":"0%"}</Text>
              </View>
            </View>
            <View className={style.task1_bottom}>
              <View className={style.bottom_item}>
                <View className={style.title}>{duration}</View>
                <View className={style.info}>听课时长</View>
                <View className={classNames(status == 0?style.line:style.line1)}></View>
              </View>
              <View className={style.bottom_item}>
                <View className={style.title}>{subjectCompletedNum?subjectCompletedNum:0}</View>
                <View className={style.info}>做题目数量</View>
                <View className={classNames(status == 0?style.line:style.line1)}></View>
              </View>
              {status == 1 && (
              <View className={style.bottom_item}>
                <View className={style.title}>{this.state.attendance}</View>
                <View className={style.info}>出勤率</View>
                <View className={style.line1}></View>
              </View>
              )}
              <View className={style.bottom_item}>
                <View className={style.title}>{rank?rank:0}</View>
                <View className={style.info}>当前排名</View>
              </View>
            </View>
          </View>
          {status == 0 && (
            <View>
              <View className={style.task2}>
                <View className={style.task2_header}>
                  <View className={style.task2_header1}></View>
                  <View className={style.task2_header2}>待完成子任务</View>
                  <View className={style.task2_header3}>
                    <Image
                      className={style.img}
                      src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png"
                    ></Image>
                    <Text style={{ color: "#3C3D41;" }}>0{sectionList.starNum?sectionList.starNum:0}</Text>/03
                  </View>
                </View>
                <View className={style.task2_content}>
                  {list.map(item => {
                    return (
                      <View className={style.content_item} key={item.id}>
                        <View className={style.item_left}>{item.title}</View>
                        <View className={style.item_right}>
                          <View className={style.info}>{item.info}</View>
                          <View
                            className={
                              item.type == 0
                                ? `${style.right_button}`
                                : `${style.right_button} ${style.button1}`
                            }
                            onClick={() =>{this.handleSectionRoute(item)}}
                          >
                            前往
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
              {/* <View className={style.task3}>
                <View className={style.task3_content}>
                  <View className={style.left1}></View>
                  <View className={style.left2}>错题本</View>
                  <View className={style.right}>
                    <View className={style.info}>共{wrongAnsweredCount?wrongAnsweredCount:0}题</View>
                    <View className={style.right_button} onClick={() =>{Taro.navigateTo({url: "/pages/book/book?bookId=1"})}}>重做</View>
                  </View>
                </View>
              </View> */}
            </View>
          )}
          {status == 1 && (
            <View className={style.task4}>
              <View className={style.task4_header}>
                <View className={style.task4_header1}></View>
                <View className={style.task4_header2}>待完成任务</View>
              </View>
              <View className={style.task4_content}>
                {courseList.map(item => {
                  return item.learningPro != "100.00%" && (
                    <View className={style.content_item} key={item.classplanId}>
                      <View className={style.item_left}>
                        <View className={style.left1}>{item.classplanLiveName}</View>
                        <View className={style.left2}>
                          <Image
                            className={style.img}
                            src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png"
                          ></Image>
                          <Text style={{ color: "#3C3D41;" }}>
                            {item.doneProcessCount?numberFormat(item.doneProcessCount.split('/')[0]):0}
                          </Text>/{item.doneProcessCount?numberFormat(item.doneProcessCount.split('/')[1]):0}
                        </View>
                      </View>
                      <View className={style.item_right}>
                        <View className={style.right_button} 
                        onClick={() =>{Taro.navigateTo({url: `/pages/course/course?trainId=${item.trainId}&classpalnId=${item.classplanId}&title=${item.classplanLiveName}`})}}>前往</View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
        <AtFloatLayout isOpened={showNote} onClose={() => this.handleClose()}>
          <View className={style.showNote_header}>
            <View className={style.title}>考霸笔记</View>
            <View
              onClick={this.handleClose}
            >
              <Image className={style.img} src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/close.png`}></Image>
            </View>
          </View>
          <View className={style.noteList}>
            {/* {showProgress && <View><Progress percent={dwProgress} showInfo strokeWidth={4} /></View>} */}
            {noteList.length == 0 && <Image
              className={style.noteEmpty}
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/empty.png'
            />}
            {
              noteList.map(item =>{
                return  (
                  <View className={style.noteItem} onClick={() => this.downloadFile(item.fileUrl)}>
                    <Image className={style.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/pdf.png'></Image>
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

export default ReportUnfinished;
