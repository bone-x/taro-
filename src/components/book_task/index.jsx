import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import style from './index.module.less';
// @connect(state => state.book, { changeBookId })
class BookTask extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      open: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidShow() {}

  componentDidHide() {}

  toggle = e => {
    const { open } = this.state;
    this.setState({
      open: !open
    });
  };

  goTitle(k) {
    Taro.navigateTo({
      url: `/pages/Test/testHomeWork/index?code=${k.code}`
    });
  }

  render() {
    const { open } = this.state;
    const { topicTypeList, bookId } = this.props;
    console.log(topicTypeList, '3333333333');
    // console.log(this.props.id)
    return (
      <View className={style.task_container}>
        <View className={style.title} onClick={this.toggle}>
          <View className={style.title_left}>{topicTypeList.chapterName}</View>
          <View className={style.title_right}>
            <Text className={style.info}>
              共
              {bookId === 1 ? topicTypeList.amount : topicTypeList.subjectCount}
              题
            </Text>
            <Image
              className={style.img}
              src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/arrow-${
                open ? 'up' : 'down'
              }.png`}
            ></Image>
          </View>
        </View>
        {open && (
          <View className={style.content}>
            <View className={style.line}></View>
            <View className={style.content_list}>
              {(bookId === 1
                ? topicTypeList.sectionList
                : topicTypeList.sectionVOList
              ).map((k, i) => {
                return (
                  <View
                    className={style.list_item}
                    onClick={this.goTitle.bind(this, k)}
                    key={i}
                  >
                    <View className={style.item_left}>
                      <View className={style.left_title}>{k.sectionName}</View>
                      <View className={style.left_sec}>
                        共{bookId === 1 ? k.amount : k.subjectCount}题
                      </View>
                    </View>
                    <View className={style.item_right}>
                      <View className={style.right_sec}>
                        {bookId == 1 ? '重做' : '答题'}
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* <View className={style.list_item}>
                <View className={style.item_left}>
                  <View className={style.left_title}>
                    任务三 会计核算的基础：收付实
                  </View>
                  <View className={style.left_sec}>共20题</View>
                </View>
                <View className={style.item_right}>
                  <View className={style.right_sec}>答题</View>
                </View>
              </View>

              <View className={style.list_item}>
                <View className={style.item_left}>
                  <View className={style.left_title}>
                    任务三 会计核算的基础：收付实
                  </View>
                  <View className={style.left_sec}>共20题</View>
                </View>
                <View className={style.item_right}>
                  <View className={style.right_sec}>答题</View>
                </View>
              </View> */}
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default BookTask;
