import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { AtCountdown, AtModal } from "taro-ui";
import styles from "./index.module.less";
import Analysis from "@/components/analysis";
import Fetch from "@/api/request";
import { connect } from "@tarojs/redux";
@connect(state => state.oraltitle)
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      curr: 0,
      isCollet: [],
      startX: 0, //开始坐标
      startY: 0,
      list: [],
      countTime: "",
      allList: {},
      isOpened: false
    };
  }
  config = {
    navigationBarTitleText: "全部解析",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
    this.getExamAnalysis();
  }

  getExamAnalysis = async () => {
    //获取试卷试题type==1\仿真测试   拉链测试 dostatus==全部 ==2做错
    let { recordId, dostatus } = this.$router.params;

    let res = await Fetch("getExamAnalysis", { recordId, isRedo: false });
    let wrong = res.subjectVOList.filter(
      (item, index) => item.examRecordDetail && !item.examRecordDetail.isTrue
    );
    console.log("------------------");
    console.log(wrong);
    this.collect(res.subjectVOList); //做收藏
    let list = dostatus == 1 ? res.subjectVOList : wrong;

    this.setState({
      list,
      allList: res
    });
    Taro.setNavigationBarTitle({
      title: res.name
    });
  };
  collect = data => {
    let isCollets = data.map((item, index) => (item.isCollect ? true : false));
    this.setState({ isCollet: isCollets });
  };
  swiper = e => {
    //轮播滑动触发
    this.setState({ curr: e.detail.current });
  };
  left = () => {
    let { curr } = this.state;
    curr >= 1 && this.setState({ curr: curr - 1 });
  };
  right = () => {
    let { curr, list } = this.state;
    curr < list.length - 1 && this.setState({ curr: curr + 1 });
  };
  collet = async () => {
    let { isCollet, list, curr } = this.state;
    let res = await Fetch("updateNoteBook", {
      subjectId: list[curr].subjectId,
      isShow: !isCollet[curr] ? 1 : 0
    });
    isCollet.splice(curr, 1, !isCollet[curr]);
    this.setState({ isCollet });
  };
  touchstart = e => {
    this.setState({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    });
  };
  touchmove = e => {
    let { startX, startY, curr } = this.state; //开始X坐标//开始Y坐标
    let touchMoveX = e.changedTouches[0].clientX; //滑动变化坐标
    let touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    // var isLeft = _class.indexOf("leftMove") != -1; //往左滑的位置
    // var isRight = _class.indexOf("rightMove") != -1;//往右滑的位置

    //获取滑动角度
    let angle = this.angle(
      { X: startX, Y: startY },
      { X: touchMoveX, Y: touchMoveY }
    );
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    //右滑
    if (touchMoveX > startX) {
      //   console.log("右滑");
      this.left();
    } else if (touchMoveX - startX < -10) {
      //左滑
      this.right();
    }
  };
  angle = (start, end) => {
    let _X = end.X - start.X,
      _Y = end.Y - start.Y;
    //返回角度 /Math.atan()返回数字的反正切值
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI);
  };
  handleConfirm = () => {
    Taro.navigateBack({ delta: 1 });
  };
  go = () => {
    let { examId } = this.$router.params;
    Taro.navigateTo({
      url: `/pages/commonAnswer/index?type=2&paperId=${this.state.allList.paperId}&examId=${examId}&recordId=${this.state.allList.recordId}`
    });
  };
  render() {
    const { curr, isCollet, list, countTime, allList, isOpened } = this.state;
    const scrollStyle = {
      height: "100%"
    };
    const scrollTop = 0;
    const Threshold = 20;
    return (
      <View className={styles.content}>
        {/* 头部 */}
        <header>
          <View className={styles.title}>{list[curr].subjectTypeName}</View>
          <View className={styles.time}></View>
          <View className={styles.num}>
            <Text className={styles.curr}>{curr + 1}</Text>/{list.length}
          </View>
        </header>
        <View
          className={styles.Box}
          onTouchStart={this.touchstart}
          onTouchEnd={this.touchmove}
        >
          <ScrollView
            className="scrollview"
            scrollY
            scrollWithAnimation
            scrollTop={scrollTop}
            style={scrollStyle}
            lowerThreshold={Threshold}
            upperThreshold={Threshold}
          >
            <View className={styles.swiperBox}>
              {allList && (
                <Analysis item={list[curr]} allList={allList} curr={curr} />
              )}
            </View>
          </ScrollView>
        </View>
        <footer>
          <View className={styles.foot}>
            <View className={styles.icon} onClick={this.left}>
              <Image
                src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/leftIcon.png"
                className={styles.img}
              />
            </View>
            <View className={styles.icon} onClick={this.collet}>
              <View>
                <Image
                  src={
                    isCollet[curr]
                      ? "https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/hotHert.png"
                      : "https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/hert.png"
                  }
                  className={styles.specialIcon}
                />
                <View>{isCollet[curr] ? "已收藏" : "收藏"}</View>
              </View>
            </View>
            <View className={[styles.icon, styles.gray].join(" ")}>
              <View>
                <Image
                  src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/book.png"
                  className={styles.specialIcon}
                />
                <View>答题卡</View>
              </View>
            </View>
            <View className={styles.icon} onClick={this.right}>
              <Image
                src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/righticon.png"
                className={styles.img}
              />
            </View>
          </View>
        </footer>
      </View>
    );
  }
}

export default Index;
