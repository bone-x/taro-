import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import fetch from '@/api/request.js'
import style from "./report-finished.module.less";

import { connect } from '@tarojs/redux'
@connect(state => state.course)

class ReportFinished extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      status: 0, //0:任务已完成 1:课程已完成
      list:[
        {id:0,content:'知识点掌握度',num:'0%'},
        {id:1,content:'累计答题正确率',num:'0%'},
        {id:2,content:'掌握知识点数',num:'0'},
        {id:3,content:'首次答题正确率',num:'0%'}
      ],
      reportData:{},
      duration:"0h"
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
    console.log(this.props);
    if(this.state.status == 0){
      this.getSectionData();
      this.getSectionDuration();
    }else{
      this.getCourseData();
      this.getCourseDuration();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
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
  getCourseData(){
    fetch("getCourseReport", {
      courseCode: this.props.courseInfo.courseNo
    })
      .then((res) => {
        console.log(res);
        this.setState({reportData:res},()=>{this.handleReportData(res)})
      })
      .catch(error => {
        console.log(error);
      });
  }
  getSectionData(){
    fetch("getSectionReport", {
      sectionCode: this.props.sectionList.trainNo
    })
      .then((res) => {
        console.log(res);
        this.setState({reportData:res},()=>{this.handleReportData(res)})
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleReportData(res){
    let {list} = this.state
    list[0].num = res.knpMasterRatio?(res.knpMasterRatio*100).toFixed(0)+'%':"0%";
    list[1].num = res.answerRightRatio?(res.answerRightRatio*100).toFixed(0)+'%':"0%";
    list[2].num = res.knpMasterCount?res.knpMasterCount:0;
    list[3].num = res.firstAnswerRightRatio?(res.firstAnswerRightRatio*100).toFixed(0)+'%':"0%";
    this.setState({list})
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

  render() {
    const { status, list, reportData, duration } = this.state;
    const course = this.props.sectionList;
    return (
        <View className={style.finished}>
          {status == 0 && (
            <View className={style.header}>
              <View className={style.header_h1}>恭喜完成当前任务</View>
              <View className={style.header_h2}>任务{this.numberFormat(course.index)}已完成</View>
            </View>
          )}
          {status == 1 && (
            <View className={style.header1}>
              <View className={style.header_h1}>恭喜完成所有课程</View>
            </View>
          )}
          <View className={style.content}>
            <View className={style.list}>
              {list.map(item=>{
              return(
              <View className={style.item} key={item.id}>
                <View className={style.icon}>
                  <Image className={style.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/report/right.png' />
                </View>
                <View className={style.title}>{item.content}</View>
              <View className={style.num}>{item.num}</View>
              </View>
              )
              })}
            </View>
            <View className={style.task1_bottom}>
              <View className={style.bottom_item}>
                <View className={style.title}>{duration}</View>
                <View className={style.info}>听课时长</View>
                <View className={style.line}></View>
              </View>
              <View className={style.bottom_item}>
                <View className={style.title}>{reportData.subjectCompletedNum?reportData.subjectCompletedNum:0}</View>
                <View className={style.info}>做题目数量</View>
                <View className={style.line}></View>
              </View>
              <View className={style.bottom_item}>
                <View className={style.title}>{reportData.rank?reportData.rank:0}</View>
                <View className={style.info}>当前排名</View>
              </View>
            </View>
          </View>
          {/* {status == 0 && (
            <View className={style.task3}>
              <View className={style.task3_content}>
                <View className={style.left1}></View>
                <View className={style.left2}>错题本</View>
                <View className={style.right}>
                <View className={style.info}>共{reportData.wrongAnsweredCount?reportData.wrongAnsweredCount:0}题</View>
                  <View className={style.right_button} onClick={() =>{Taro.navigateTo({url: "/pages/book/book?bookId=1"})}}>重做</View>
                </View>
              </View>
            </View>
          )} */}
        </View>
    );
  }
}

export default ReportFinished;
