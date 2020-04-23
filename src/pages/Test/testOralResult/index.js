import Taro, { Component } from "@tarojs/taro";
import { View, Text, Canvas } from "@tarojs/components";
import styles from "./index.module.less";
import QuestionNumber from "@/components/questionNumber";
import Fetch from "@/api/request";
class Index extends Component {
  state = {
    // degree: 80,
    listCard: null,
    statusList: [],
    r: 0
  };
  config = {
    navigationBarTitleText: "入营测试结果",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
    this.getReport();
  }
  go = () => {
    Taro.redirectTo({
      url: "/pages/entryTest/index?status=2"
    });
  };
  getReport = async () => {
    //考试结果
    let { paperId, justLook = false } = this.$router.params;

    let res = await Fetch("getReport", { paperId });
    let data =
      !justLook && (await Fetch("subscribeGoods", { score: res.totalScore }));
    let r = res.totalScore && (res.totalScore / res.paperTotalScore) * 100;

    this.setState(
      { listCard: res, statusList: res.cpRecordDetailList, r },
      () => {
        res.totalScore > 0
          ? this.draw(0, res.totalScore, 10, 70, 70, res.paperTotalScore)
          : this.circle(70, 70); //开始角度 结束 时间 横坐标 众坐标  圆形总的值
      }
    );
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
    ctx2.fillText(0, w, h - 10); // 文字内容和文字坐标
    ctx2.draw();
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
  render() {
    const { listCard, statusList, r } = this.state;
    return (
      <View>
        <View className={styles.header}>
          <View>试卷总分:{listCard.paperTotalScore}</View>
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
          <View className={styles.txt}>恭喜您已完成入营测试，预约课程成功</View>
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
        </View>
        {/* foot */}
        <View className={styles.foot}>
          <View
            className={[styles.all, styles.btn].join(" ")}
            onClick={this.go}
          >
            下一步
          </View>
          {/* <View className={[styles.wrong, styles.btn].join(" ")} >
              下一步
            </View> */}
        </View>
      </View>
    );
  }
}
export default Index;
