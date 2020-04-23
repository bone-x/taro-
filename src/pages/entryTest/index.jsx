/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-21 19:05:15
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-14 15:31:29
 */
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import fetch from '@/api/request.js';
import style from './index.module.less';

// const app = Taro.getApp();

class entryIndex extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      paperId: 0,
      paperDetail: {},
      purchaseStatus: 1
      // countTime: 0
    };
  }

  componentWillMount = async () => {
    let paperId = await fetch('campTestExamId');
    let paperDetail = await fetch('openPaper', {
      paperId
    });

    this.setState({
      paperId,
      paperDetail
    });
  };
  componentDidMount() {}

  componentWillReceiveProps() {}

  componentDidShow() {
    this.getStatus();
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: '入营测试',
    navigationBarBackgroundColor: '#13C799',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default',
    backgroundTextStyle: 'dark',
    backgroundColor: '#13C799',
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };

  gotoDetail = () => {
    Taro.navigateTo({
      url: '/pages/bookSuccess/index'
    });
  };

  goTest = status => {
    fetch('campTestExamId').then(res => {
      let url = `/pages/Test/oralHomeWork/index?paperId=${res}`;
      if (status) {
        url = `/pages/Test/testOralResult/index?paperId=${res}&justLook=true`;
        console.log(url);
      }
      Taro.navigateTo({
        url
      });
    });
  };

  getStatus = () => {
    fetch('getPurchaseStatu').then(res => {
      const { purchaseStatus } = res;
      Taro.setStorageSync('purchaseStatus', purchaseStatus);
      Taro.setNavigationBarTitle({
        title: purchaseStatus * 1 !== 1 ? '预约成功' : '入营测试'
      });
      this.setState({
        purchaseStatus
      });
      this.gotoWhere(purchaseStatus);
    });
  };

  gotoWhere = purchaseStatus => {
    switch (purchaseStatus) {
      case 3:
        Taro.redirectTo({
          url: '/pages/classList/class-list'
        });
        break;
      default:
        break;
    }
  };

  // getTime = () => {
  //   const { paperDetail } = this.state;
  //   let countTime =
  //     new Date(paperDetail.endTime).getTime() -
  //     new Date(paperDetail.startTime).getTime();
  //   this.setState(
  //     {
  //       countTime: countTime / (1000 * 60)
  //     },
  //     () => {
  //       console.log(this.state, '11111');
  //     }
  //   );
  // };
  render() {
    const { paperDetail, purchaseStatus } = this.state;
    return (
      <View className={style.entry_test_block}>
        <View className={style.block_container}>
          <View className={style.entry_test_header}>
            <View className={style.header_h1}>
              {purchaseStatus * 1 === 1
                ? '在预约前请先完成入营测试'
                : '恭喜您已完成入营测试'}
            </View>
            <View className={style.header_h2}>
              {purchaseStatus * 1 === 1
                ? '本测试仅作答一次 请谨慎作答'
                : '请等待我们的招生老师与您联系'}
            </View>
          </View>
          <View className={style.entry_test_content}>
            <View className={style.content_title}>{paperDetail.paperName}</View>
            <View className={style.content_box}>
              <View className={style.test_box}>
                <Image src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png' />
                <Text>共计：{paperDetail.subjectList.length}题</Text>
              </View>
              <View className={style.num_box}>
                <Image src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png' />
                <Text>答题时间：{paperDetail.totalDuration}分钟</Text>
              </View>
              {purchaseStatus * 1 === 2 ? (
                <View>
                  <Button
                    className={style.btn_box1}
                    onClick={() => this.goTest(1)}
                  >
                    查看结果
                  </Button>
                  <View className={style.link_box} onClick={this.gotoDetail}>
                    点击这里查看课程安排和注意事项
                  </View>
                </View>
              ) : (
                <Button
                  className={style.btn_box}
                  onClick={() => this.goTest(0)}
                >
                  开始答题
                </Button>
              )}
            </View>
          </View>
        </View>
        {/* {status*1 === 1 ? (
          <View
            className={[`${style.block_footer}`, `${style.block_success}`].join(
              ' '
            )}
          >
            预约课程
          </View>
        ) : (
          <View
            className={[`${style.block_footer}`, `${style.block_success}`].join(
              ' '
            )}
          >
            预约成功
          </View>
        )} */}
      </View>
    );
  }
}

export default entryIndex;
