import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
// import eventBus from "../../utils/eventBus";
import fetch from '@/api/request'
import style from "./index.module.less";
const token = Taro.getStorageSync("token");
class Exercise extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [
        // {
        //   id: 0,
        //   title: "中小企业人力资源组织与管理和宏观可调控",
        //   time: "2020-02-01 10：23"
        // },
        // { id: 1, title: "仿真测试二", time: "2020-02-01 10：23" },
        // { id: 2, title: "仿真测试三", time: "2020-02-01 10：23" }
      ]
    };
  }
  config = {
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidShow() {}

  componentDidHide() {}
  //获取回放练习题列表
  getExercisesList = () => {
    fetch('getExercisesList', {
      SSOTOKEN: token,
      courseClassplanLivesId: 'f716a1915e20494589add3488ec387bb',
      businessId: 'kuaiji_app'
    }).then(res => {
        this.setState({
          list:res
        })
    }).catch(err => {
      console.log(err)
    })
  }
  startTest = (param) => {
    // eventBus.emit('startTest', param)
    // this.props.doExercise(param)
  }

  render() {
    const { list } = this.state;
    return (
      <View className={style.list}>
        {list && list.length > 0 ? (
          list.map(item => {
            return (
              <View className={style.list_item} key={item.testId}>
                <View className={style.item_left}>
                  <View className={style.left_sec}>{item.updateTime}</View>
                  <View className={style.left_title}>{item.name}</View>
                </View>
                <View className={style.item_right}>
                  <View className={style.right_button} onClick={() => this.startTest(item)}>
                    <View className={style.button_sec}>答题</View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={style.empty}>
            <Image
              className={style.img}
              src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/empty.png'
            />
          <View className={style.title}>暂无内容</View>
          </View>
        )}
      </View>
    );
  }
}

export default Exercise;
