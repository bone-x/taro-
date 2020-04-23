import Taro, { Component } from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';
import fetch from '@/api/request.js';
import withShare from '@/utils/withShare';
import { connect } from '@tarojs/redux';
// import { add, minus, asyncAdd } from '../../actions/counter';
import style from './index.module.less';

const app = Taro.getApp();

// @connect(
//   ({ counter }) => ({
//     counter
//   }),
//   dispatch => ({
//     add() {
//       dispatch(add());
//     },
//     dec() {
//       dispatch(minus());
//     },
//     asyncAdd() {
//       dispatch(asyncAdd());
//     }
//   })
// )
@withShare({
  title: '2020初级考霸VIP抢分逆袭协议班' //分享标题
})
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentWillMount() {}
  componentDidMount() {}

  componentWillReceiveProps() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '首页'
  };

  goTest = () => {
    Taro.navigateTo({
      url: '/pages/Test/oralHomeWork/index'
    });
  };

  // 授权问题，如果授权了就直接登录，如果没有授权就进行授权
  tobegin(e) {
    this.setState({
      loading: true
    });
    if (e.detail.userInfo) {
      app.globalData.userInfo = Object.assign(
        app.globalData.userInfo,
        e.detail.userInfo
      );
      Taro.login().then(info => {
        fetch('loginWechat', {
          code: info.code,
          versionCode: '114',
          clientType: 'mp',
          sourceCode: 'kaoba'
        })
          .then(res => {
            this.setState({
              loading: false
            });
            if (res.token) {
              Taro.setStorageSync('token', res.token);
              fetch('getUserInfo', {
                token: Taro.getStorageSync('token')
              }).then(hqInfo => {
                app.globalData.userInfo = Object.assign(
                  app.globalData.userInfo,
                  hqInfo
                );
              });

              this.getStatus();
              // Taro.redirectTo({
              //   url: '/pages/classList/class-list'
              // });
            } else {
              //没注册
              Taro.redirectTo({
                url: '/pages/bindPhone/index'
              });
            }
          })
          .catch(err => {
            this.setState({
              loading: false
            });
            console.log(err);
            //没注册
            Taro.redirectTo({
              url: '/pages/bindPhone/index'
            });
          });
      });
    } else {
      this.setState({
        loading: false
      });
      console.log(false);
    }
  }

  getStatus = () => {
    fetch('getPurchaseStatu').then(res => {
      const { purchaseStatus } = res;
      Taro.setStorageSync('purchaseStatus', purchaseStatus);
      console.log(purchaseStatus, 'purchaseStatus');
      this.gotoWhere(purchaseStatus);
    });
  };

  gotoWhere = purchaseStatus => {
    switch (purchaseStatus) {
      case 1:
        Taro.redirectTo({
          url: '/pages/entryTest/index?status=1'
        });
        break;
      case 2:
        Taro.redirectTo({
          url: '/pages/entryTest/index?status=2'
        });
        break;
      case 3:
        Taro.redirectTo({
          url: '/pages/classList/class-list'
        });
        break;
      default:
        break;
    }
  };
  render() {
    return (
      <View className={style.index_block}>
        <View className={style.img_block}>
          <Image
            mode='widthFix'
            src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/home.png'
          />
        </View>

        <View className={style.btn_block}>
          <View>登陆后预约课程，恒企招生老师会联系您报名</View>
          <Button
            loading={this.state.loading}
            className={style.login_btn}
            openType='getUserInfo'
            onGetUserInfo={this.tobegin}
          >
            开始上课
          </Button>
        </View>
      </View>
    );
  }
}

export default Index;
