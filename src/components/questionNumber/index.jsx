import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import styles from "./index.module.less";
const QuestionNumber = ({ item }) => {
  return (
    <View>
      <View
        className={[
          styles.num,
          item.status == 1
            ? styles.right
            : item.status == 2
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
