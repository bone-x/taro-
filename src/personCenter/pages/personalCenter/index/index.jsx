import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import fetch from '@/api/request.js';
// import { connect } from '@tarojs/redux';
import style from './index.module.less';

const app = Taro.getApp();

// @connect()
class personCenter extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      mobileNo: '',
      nickName: ''
    };
  }

  componentDidMount() {
    const { nickName, mobileNo } = app.globalData.userInfo;
    if (!mobileNo) {
      fetch('getUserInfo', {
        token: Taro.getStorageSync('token')
      }).then(res => {
        this.setState({
          nickName,
          mobileNo: res.mobileNo
        });
      });
    } else {
      this.setState({
        nickName,
        mobileNo
      });
    }
  }

  componentWillReceiveProps() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '个人中心'
  };
  render() {
    return (
      <View className={style.person_block}>
        <View className={style.list_item}>
          <View className={style.list_left_item}>手机号码</View>
          <View className={style.list_right_item}>{this.state.mobileNo}</View>
        </View>
        <View className={style.list_item}>
          <View className={style.list_left_item}>昵称</View>
          <View className={style.list_right_item}>{this.state.nickName}</View>
        </View>
      </View>
    );
  }
}

export default personCenter;
