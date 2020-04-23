import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import styles from "./index.module.less";
const change = item => {
  if (item.practiceDetailStatus && item.practiceDetailStatus.doStatus) {
    return item.practiceDetailStatus.answerStatus ? 1 : 2;
  } else {
    return 3;
  }
};
const QuestionNumber = ({ item }) => {
  return (
    <View>
      <View
        className={[
          styles.num,
          change(item) == 1
            ? styles.right
            : change(item) == 2
            ? styles.wrong
            : styles.not
        ].join(" ")}
      >
        {this.props.children}
      </View>
    </View>
  );
};
QuestionNumber.defaultProps = {
  item: {}
};
export default QuestionNumber;
