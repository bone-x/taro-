import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { AtCountdown, AtModal } from "taro-ui";
import styles from "./index.module.less";
import SelectTitle from "@/components/select_title";
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
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    //获取试卷试题type==1\仿真测试   拉链测试
    let { examId } = this.$router.params;
    let res = await Fetch("openExamPaper", { examId });
    this.collect(res.subjectVOList); //做收藏
    this.setState({
      list: res.subjectVOList,
      countTime: res.examTime,
      allList: res
    });
    Taro.setNavigationBarTitle({
      title: res.examName
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
    curr == list.length - 1 && this.go();
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
  onTimeUp = async () => {
    let { examId } = this.$router.params;
    let res = await Fetch("openExamPaper", { examId });
    let arr = res.subjectVOList.filter(
      (item, index) => item.examRecordDetail !== null
    ); //arr有值已做else未做
    // console.log("--------------------");
    // console.log(arr);
    if (arr.length > 0) {
      //已做
      let params = {
        recordId: this.state.allList.recordId,
        examType: 9,
        isRedo: false
      };
      let res = await Fetch("submitExamPaper", params);
      res &&
        Taro.navigateTo({
          url: `/pages/Test/testResult/index?recordId=${this.state.allList.recordId}&type=2`
        });
    } else {
      this.setState({ isOpened: true });
    }
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
          <View className={styles.time}>
            {list.length > 0 && (
              <AtCountdown
                format={{ hours: ":", minutes: ":", seconds: "" }}
                seconds={countTime * 60}
                onTimeUp={this.onTimeUp}
              />
            )}
          </View>
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
                <SelectTitle item={list[curr]} allList={allList} curr={curr} />
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
            <View className={styles.icon}>
              <View onClick={this.go}>
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
        <AtModal
          isOpened={isOpened}
          //   title="标题"
          //   cancelText="取消"
          confirmText="返回"
          //   onClose={this.handleClose}
          //   onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content="您是白卷噢！请做题后再交卷吧"
        />
      </View>
    );
  }
}

export default Index;
