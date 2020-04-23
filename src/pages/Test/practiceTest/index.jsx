import Taro, { Component } from "@tarojs/taro";
import { View, Text, Canvas } from "@tarojs/components";
import styles from "./index.module.less";
import NumberCount from "@/components/NumberCount/index";
import Fetch from "@/api/request";
const app = Taro.getApp();
class Index extends Component {
  state = {
    // degree: 80,
    listCard: null,
    statusList: [],
    undo: 0,
    wrong: 0,
    right: 0,
    r: 0
  };
  config = {
    navigationBarTitleText: "课后练习测试结果",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white"
  };
  componentDidMount() {
    this.queryPracticeTranscript();

    // conconsole.log(app.globalData.trainId)
  }
  unLockOverloadNote = async () => {
    let res = await Fetch("unLockOverloadNote", {
      trainId: app.globalData.trainId
    });
  };
  queryPracticeTranscript = async () => {
    //课后练习结果
    let res = await Fetch("queryPracticeTranscript", {
      practiceTestUuid: this.$router.params.practiceTestId
    });
    let undo =
      res.transcriptDetailVOList &&
      res.transcriptDetailVOList.filter(
        (item, index) => item.practiceDetailStatus.doStatus == true
      ); //做的题
    let right =
      (
        undo &&
        undo.filter(
          (item, index) => item.practiceDetailStatus.answerStatus == true
        )
      ).length || "0"; //最对的
    let wrong = (undo && undo.length - right) || "0";

    // console.log("------------------------------");
    // console.log("undo", undo);
    // console.log("right", right);
    // console.log("wrong", wrong);
    // console.log("------------------------------");
    let r = (right / res.transcriptDetailVOList.length) * 100;
    // console.log("rrrrrrrrrrrrrrrrr");
    // console.log(r);
    r >= 90 && this.unLockOverloadNote();
    this.setState(
      {
        listCard: res,
        statusList: res.transcriptDetailVOList,
        undo: res.transcriptDetailVOList.length - undo.length,
        right,
        wrong,
        r
      },
      () => {
        // right && this.draw(1, r.toFixed(0), 30, 70, 70, 100);
        r > 0
          ? this.draw(1, r.toFixed(0), 30, 70, 70, 100)
          : this.circle(70, 70);
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
    ctx2.fillText(0 + "%", w, h - 10); // 文字内容和文字坐标
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
    ctx2.setFontSize(12); // 字体大小 注意不要加引号
    ctx2.setFillStyle("#292929"); // 字体颜色
    ctx2.font = "normal bold 40px PingFang SC";
    ctx2.setTextAlign("center"); // 字体位置
    ctx2.setTextBaseline("middle"); // 字体对齐方式
    ctx2.fillText(c + "%", w, h - 10); // 文字内容和文字坐标
    ctx2.draw();
  };
  go = () => {
    Taro.navigateBack({ delta: 3 });
  };
  render() {
    const { listCard, statusList, undo, wrong, right, r } = this.state;
    return (
      <View>
        {/* <View className={styles.header}> */}
        {/* <View>试卷总分:{listCard.paperScore}</View> */}
        {/* <View>交卷时间:{listCard.createTimeString}</View> */}
        {/* </View> */}
        <View className={styles.body}>
          <Canvas
            style="width: 140px; height: 140px;margin:0 auto;"
            canvasId="canvas"
          />
          <View className={styles.score}>
            {/* {r == 0 ? <View>0%</View> : null} */}
            <View className={styles.line}></View>
            正确率
          </View>
          <View className={styles.txt}>
            {r >= 60 && r < 90
              ? "还不错,正确率90%以上可解锁考霸笔记噢"
              : r > 90
              ? "恭喜您已经解锁考霸笔记"
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
                做对{`(${right})`}
              </View>
              <View className={styles.question}>
                <Text className={[styles.wrong, styles.icon].join(" ")}></Text>
                做错{`(${wrong})`}
              </View>
              <View className={styles.question}>
                <Text className={[styles.not, styles.icon].join(" ")}></Text>
                未做{`(${undo})`}
              </View>
            </View>
          </View>
          {/* 题数 */}
          <View className={styles.cardList}>
            {statusList.map((item, index) => (
              <View className={styles.list} key={index}>
                <NumberCount className={styles.list} item={item}>
                  {index + 1}
                </NumberCount>
              </View>
            ))}
          </View>
          {/* foot */}
          <View className={styles.foot}>
            <View
              className={[styles.all, styles.btn].join(" ")}
              onClick={this.go}
            >
              下一步
            </View>
            {/* <View className={[styles.wrong, styles.btn].join(" ")}>
              错题解析
            </View> */}
          </View>
        </View>
      </View>
    );
  }
}
export default Index;
