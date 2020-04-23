import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtProgress } from 'taro-ui';
import './index.less';

const app = Taro.getApp();

class Index extends Component {
  //   config = {
  //   navigationBarTitleText: '首页'
  // }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidShow() {}

  componentDidHide() {}

  formateNum = num => {
    return num >= 10 ? num : '0' + num;
  };
  getPercent = () => {
    const { curProgress, totalProgress } = this.props;
    return curProgress / totalProgress;
  };

  goStudyReport = () => {
    const url =
      '/pages/studyReport/report-' +
      (app.globalData.courseAllDone ? 'finished' : 'unfinished');
    Taro.navigateTo({
      url: url + '?trainType=0'
    });
  };

  render() {
    const { title, curProgress, totalProgress } = this.props;
    const percent = (curProgress / totalProgress) * 100;
    return (
      <View className='navBox'>
        <View>
          <View className='nav-top'>
            <View className='left'>正在学习： {title}</View>
            <View className='right'>
              <Image
                className='img'
                src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png'
              ></Image>
              <Text className='curProgress'>
                {this.formateNum(curProgress)}
              </Text>
              <Text className='separator'>/</Text>
              <Text className='totalProgress'>
                {this.formateNum(totalProgress)}
              </Text>
            </View>
          </View>
          <AtProgress percent={percent} isHidePercent></AtProgress>
        </View>
        <View className='navList'>
          <View
            className='navItem'
            onClick={() => {
              Taro.navigateTo({ url: `/pages/mistakeBook/index` });
            }}
          >
            <Image
              className='icon'
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/error_book.png'
            ></Image>
            <View className='name'>错题本</View>
          </View>
          {/* <View className='navItem' onClick={()=>{Taro.navigateTo({url: `/pages/book/book?id=${2}`})}}>
            <Image className='icon' src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/collect.png'></Image><Text className='name'>收藏夹</Text>
          </View> */}
          <View
            className='navItem'
            onClick={() => {
              Taro.navigateTo({ url: '/pages/zipper/zipper' });
            }}
          >
            <Image
              className='icon'
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/practise.png'
            ></Image>
            <Text className='name'>仿真拉练</Text>
          </View>
          <View className='navItem' onClick={this.goStudyReport}>
            <Image
              className='icon'
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/study_report.png'
            ></Image>
            <Text className='name'>学习报告</Text>
          </View>
          <View
            className='navItem'
            onClick={() => {
              Taro.navigateTo({ url: '/pages/honour/honour' });
            }}
          >
            <Image
              className='icon'
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/medal.png'
            ></Image>
            <Text className='name'>荣誉勋章</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
