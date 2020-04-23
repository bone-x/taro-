/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-21 19:05:15
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-16 09:53:16
 */
import Taro, { Component } from '@tarojs/taro';
import { View, WebView } from '@tarojs/components';
import style from './index.module.less';

class videoParsing extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '视频解析'
  };

  render() {
    let { VID } = this.$router.params;
    return (
      <View className={style.video_parse_block}>
        <WebView
          src={`https://polyv.hqjy.com/front/video/view?vid=${VID}`}
        ></WebView>
      </View>
    );
  }
}

export default videoParsing;
