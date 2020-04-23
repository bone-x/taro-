/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-21 19:05:15
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-17 11:28:00
 */
import Taro, { Component } from '@tarojs/taro';
import { View, WebView } from '@tarojs/components';
import fetch from '@/api/request.js';

import { connect } from '@tarojs/redux';
import style from './index.module.less';

@connect(state => state.course)
class mistakeBook extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isShow: false,
      courseCode: 0,
      uuid: 0,
      token: 0
    };
  }

  componentWillMount = async () => {
    let res = await fetch('getCourseInfo', {
      courseCode: this.props.courseInfo.courseNo
    });
    this.setState({
      courseCode: this.props.courseInfo.courseNo,
      uuid: res.uuid,
      isShow: true,
      token: Taro.getStorageSync('token')
    });
  };
  componentDidMount() {}

  componentWillReceiveProps() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '错题本'
  };

  render() {
    let { isShow, courseCode, uuid, token } = this.state;
    return (
      <View className={style.video_parse_block}>
        {isShow ? (
          <WebView
            src={`https://mtiku2.beta.hqjy.com/redo?type=4&courseCode=${courseCode}&uuid=${uuid}&token=${token}&unlockRate=0&proId=1&appChildStr=app%26history.aspx`}
          ></WebView>
        ) : null}
      </View>
    );
  }
}

export default mistakeBook;
