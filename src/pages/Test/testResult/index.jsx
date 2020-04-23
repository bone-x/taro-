import Taro, { Component } from "@tarojs/taro";
import { View, Text, Canvas } from "@tarojs/components";
import styles from "./index.module.less";
import QuestionNumber from "@/components/questionNumber/index";
import Fetch from "@/api/request";
import { connect } from "@tarojs/redux";
@connect(state => state.course)
class Index extends Component {
  state = {
    // degree: 80,
    listCard: null,
    statusList: [],
    r: 0,
    doWrong: 0
  };
  config = {
    navigationBarTitleText: "测试结果",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
    this.getExamResultReport();
    this.completeSection(); //试卷已经做过
  }
  completeSection = async () => {
    let { trainId } = this.props.courseDetail;
    let res = await Fetch("completeSection", { trainId });
  };

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidShow() {}
  //   getExamList = async () => {
  //     let res = await Fetch("getExamList", { examType: 9 });
  //     console.log(res);
  //   };
  getExamResultReport = async () => {
    //考试结果
    let { recordId } = this.$router.params;
    let res = await Fetch("getExamResultReport", {
      isRedo: false,
      recordId
    });
    // let r = res.examScore && (res.examScore / res.paperScore) * 100;
    // console.log("------------------");
    // console.log(r);
    let r = res.examScore;
    this.setState(
      {
        listCard: res,
        statusList: JSON.parse(res.statusList),
        r,
        doWrong: res.errorNum
      },
      () => {
        res.examScore > 0
          ? this.draw(1, res.examScore, 10, 70, 70, res.paperScore)
          : this.circle(70, 70);
      }
    );
  };
  circle = (w, h) => {
    const ctx2 = Taro.createCanvasContext("canvas");
    ctx2.beginPath();
    // let num2 = ((360 * Math.PI) / 100) * 1 - 0.5 * Math.PI;
    // //圆环的绘制
    ctx2.arc(w, h, w - 6, -0.5 * Math.PI, 360); //绘制的动
    ctx2.setLineWidth(6);
    ctx2.setStrokeStyle("#EAEEF2");
    // ctx2.shadowBlur = 200;
    // ctx2.shadowColor = "#aaa";
    ctx2.stroke();
    //开始绘制文字部分
    ctx2.beginPath();
    ctx2.setFontSize(12); // 字体大小 注意不要加引号
    ctx2.setFillStyle("#292929"); // 字体颜色
    ctx2.font = "normal bold 40px PingFang SC";
    ctx2.setTextAlign("center"); // 字体位置
    ctx2.setTextBaseline("middle"); // 字体对齐方式
    ctx2.fillText(0 + "%", w, h - 10); // 文字内容和文字坐标
    ctx2.draw();
  };
  draw = (start, end, time, w, h, degree) => {
    start++;
    if (start > end) {
      return false;
    }
    this.canvans(start, w, h, degree); //调用run方法
    setTimeout(() => {
      this.draw(start, end, time, w, h, degree);
    }, time);
  };

  canvans = (c, w, h, degree) => {
    const ctx2 = Taro.createCanvasContext("canvas");
    //开始绘制外层灰色的圆======
    ctx2.beginPath();
    // let num2 = ((360 * Math.PI) / 100) * 1 - 0.5 * Math.PI;
    // //圆环的绘制
    ctx2.arc(w, h, w - 6, -0.5 * Math.PI, 360); //绘制的动
    ctx2.setLineWidth(6);
    ctx2.setStrokeStyle("#EAEEF2");
    // ctx2.shadowBlur = 200;
    // ctx2.shadowColor = "#aaa";
    ctx2.stroke();
    //开始绘制绿色百分比的圆灰色的圆======
    ctx2.beginPath();
    let num = ((2 * Math.PI) / degree) * c - 0.5 * Math.PI;
    ctx2.arc(w, h, w - 6, -0.5 * Math.PI, num); //绘制的动作
    ctx2.setStrokeStyle("#13C799"); //圆环线条的颜色
    ctx2.setLineWidth(6); //圆环的粗细
    ctx2.setLineCap("round"); //圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
    ctx2.stroke();
    //开始绘制文字部分
    ctx2.beginPath();
    ctx2.setFontSize(24); // 字体大小 注意不要加引号
    ctx2.setFillStyle("#292929"); // 字体颜色
    ctx2.font = "normal bold 40px PingFang SC";
    ctx2.setTextAlign("center"); // 字体位置
    ctx2.setTextBaseline("middle"); // 字体对齐方式
    ctx2.fillText(c, w, h - 10); // 文字内容和文字坐标
    ctx2.draw();
  };
  go(dostatus) {
    let { doWrong } = this.state;
    let { recordId } = this.$router.params;
    if (dostatus == 2 && doWrong == 0) {
      Taro.showToast({ title: "您没有错题噢！", duration: 1000 });
    } else {
      Taro.navigateTo({
        url: `/pages/Test/allTestAnalysis/index?recordId=${recordId}&dostatus=${dostatus}`
      });
    }
  }
  render() {
    const { listCard, statusList, r } = this.state;
    return (
      <View>
        <View className={styles.header}>
          <View>试卷总分:{listCard.paperScore}</View>
          <View>交卷时间:{listCard.submitTime}</View>
        </View>
        <View className={styles.body}>
          <Canvas
            style="width: 140px; height: 140px;margin:0 auto;"
            canvasId="canvas"
          />
          <View className={styles.score}>
            {/* {r == 0 ? <View>0</View> : null} */}
            <View className={styles.line}></View>
            分数
          </View>
          <View className={styles.txt}>
            {r >= 60
              ? "掌握程度还不错，继续加油"
              : "掌握程度一般，还有待加强噢！"}
          </View>
        </View>
        <View className={styles.heightLine}></View>
        <View className={styles.card}>
          {/*  头 */}
          <View className={styles.head}>
            <View className={styles.name}>答题卡</View>
            <View className={styles.list}>
              <View className={styles.question}>
                <Text className={[styles.right, styles.icon].join(" ")}></Text>
                做对{`(${listCard.rightNum})`}
              </View>
              <View className={styles.question}>
                <Text className={[styles.wrong, styles.icon].join(" ")}></Text>
                做错{`(${listCard.errorNum})`}
              </View>
              <View className={styles.question}>
                <Text className={[styles.not, styles.icon].join(" ")}></Text>
                未做{`(${listCard.noDoNum})`}
              </View>
            </View>
          </View>
          {/* 题数 */}
          <View className={styles.cardList}>
            {statusList.map((item, index) => (
              <View className={styles.list} key={index}>
                <QuestionNumber item={item} className={styles.list}>
                  {index + 1}
                </QuestionNumber>
              </View>
            ))}
          </View>
          {/* foot */}
          <View className={styles.foot}>
            <View
              className={[styles.all, styles.btn].join(" ")}
              onClick={() => this.go(1)}
            >
              全部解析
            </View>
            <View
              className={[styles.wrong, styles.btn].join(" ")}
              onClick={() => this.go(2)}
            >
              错题解析
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Index;
