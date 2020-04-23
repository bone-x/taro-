import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import fetch from '@/api/request.js';
import withShare from '@/utils/withShare';
import { connect } from '@tarojs/redux';
import {
  addSection,
  addCourse,
  addCourseList,
  addCourseInfo
} from '../../actions/course';
import URI from 'urijs';
import styles from './class-list.module.less';
import RenderItem from './RenderItem';

// console.log(RenderItem);
const app = Taro.getApp();
// import MySwiper from '@/components/swiper'
@connect(state => state.course, {
  addSection,
  addCourse,
  addCourseList,
  addCourseInfo
})
class ClassList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      avatarUrl: '',
      color: 'pink',
      nickName: '',
      title: '',
      percent: '',
      chapterList: [], // 章列表
      sectionDetail: null // 当前正在学习的课次
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  async componentDidShow() {
    console.log('class-list did show');
    const { userInfo } = app.globalData;
    const wxAvatar = userInfo.avatarUrl;
    let nickName = userInfo.nickName || '小恒学会计';
    this.setState({
      avatarUrl: wxAvatar ? wxAvatar : this.state.avatarUrl,
      nickName
    });
    let courseDetail = await fetch('getCourseList');
    const { classPlanId, courseName, courseProgress } = courseDetail[0];
    this.props.addCourseInfo(courseDetail[0]);
    this.setState(
      {
        title: courseName,
        percent: courseProgress
      },
      () => {
        console.log('111', this.state);
      }
    );
    fetch('getChapterList', {
      classPlanId
    }).then(res => {
      this.setState({
        chapterList: res.chapter,
        sectionDetail: res.sectionDetail
      });
      this.props.addSection(res.sectionDetail); // 缓存正在学习的任务信息
      this.props.addCourseList(res.chapter); // 缓存课程列表
      let unDoneList = res.chapter.filter(
        item => parseFloat(item.learningPro) < 100
      );
      unDoneList.length == 0 && (app.globalData.courseAllDone = true);
    });
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: '课程列表页',
    navigationBarBackgroundColor: '#f9f8fd',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default',
    backgroundTextStyle: 'dark',
    backgroundColor: '#f9f8fd',
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };

  // 点击进去个人中心
  gotoPersonCenter = () => {
    Taro.navigateTo({
      url: `/personCenter/pages/personalCenter/index/index`
    });
  };

  render() {
    const { chapterList, sectionDetail = null, liveState } = this.state;
    return (
      <View className={styles.class_list_block}>
        <View className={styles.header}>
          <View className={styles.header_left} onClick={this.gotoPersonCenter}>
            <Image src={this.state.avatarUrl}></Image>
          </View>
          <View className={styles.header_right}>
            <Text className={styles.sec_title}>HI,{this.state.nickName}</Text>
            <Text className={styles.sec_info}>在恒企，遇见不一样的自己</Text>
          </View>
        </View>
        <View className={styles.list_block}>
          <View className={styles.list_block_header}>
            <View className={styles.header_title}>{this.state.title}</View>
            <View className={styles.header_percent}>
              课程总进度 {this.state.percent}
            </View>
          </View>
          <View className={styles.list_block_container}>
            {chapterList.map((item, index) => {
              const isActive = sectionDetail.parentId == item.trainId;
              return (
                <RenderItem
                  addCourse={this.props.addCourse}
                  param={item}
                  isActive={isActive}
                  key={item.trainId}
                  index={index}
                ></RenderItem>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

export default ClassList;
