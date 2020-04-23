/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-21 19:05:15
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-06 09:50:29
 */
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import fetch from '@/api/request.js';
import style from './index.module.less';

const app = Taro.getApp();

class bookSuccess extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '预约成功',
    navigationBarBackgroundColor: '#13C799',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default',
    backgroundTextStyle: 'dark',
    backgroundColor: '#13C799',
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };

  render() {
    // const { list } = this.state;
    return (
      <View className={style.book_success_block}>
        <Image
          mode='widthFix'
          src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/book-success.png'
        />
        {/* <View className={style.container_box}>
          <View className={style.img_box}>
            <Image src={require(`@/assets/images/bookSuccess.png`)}></Image>
          </View>
          <Text>恭喜你预约入营成功</Text>
          <Button className={style.btn_box}>我也报名</Button>
        </View>
        <View className={style.list_box}> */}
        {/* {list.map((item, index) => (
            <View
              className={style.list_item}
              key={index + 1}
              style={{ border: index == list.length - 1 ? '0' : '' }}
            >
              <View className={style.left_item}>
                <Image src={item.imgSrc} />
                <Text style={{ 'margin-left': '13px' }}>{item.text}</Text>
              </View>
              <View className={style.right_item}>
                < Image src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/arrow-down.png'/>
              </View>
            </View>
          ))}
        </View> */}
      </View>
    );
  }
}

export default bookSuccess;
