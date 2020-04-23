import Taro from '@tarojs/taro';
import { View, Text, Image, Progress } from '@tarojs/components';
import styles from './index.module.less';
import { convertNumber } from "@/utils/numberFormat";

function RenderItem(props) {
  let { param = {}, index = 0, isActive } = props;
  let doneProcessCount = param.doneProcessCount;
  doneProcessCount = doneProcessCount ? doneProcessCount.split('/') : [0, 0];

  const numberFormat = val => {
    return parseInt(val) < 10 ? '0' + val : val;
  };

  const converTitle = () => {
    if(!param.classplanLiveName) return ''
    return param.classplanLiveName.replace(/.*?(?:章)/, '阶段'+convertNumber(index + 1))
  }

  const goTo = () => {
    if (!param.classplanId) {
      Taro.showToast({
        title: '该课程尚未排课',
        icon: 'none'
      });
    } else {
      console.log('param', param);
      props.addCourse(param);
      Taro.navigateTo({
        url: `/pages/course/course?trainId=${param.trainId}&classpalnId=${param.classplanId}&title=${param.classplanLiveName}`
      });
    }
  };

  const imgNum = index => {
    if (index < 6) {
      return index + 1;
    } else {
      return Math.floor(Math.random() * 6 + 1);
    }
  };

  return (
    <View className={styles.item_block} onClick={goTo}>
      <View className={styles.item_left}>
        <Image
          src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/icon/class-list/${imgNum(
            this.props.index
          )}.png`}
        />
      </View>
      <View className={styles.item_right}>
        <View className={styles.item_title}>
          <Text>{converTitle()}</Text>
          {isActive && (
            <View>
              <Image src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/live.gif' />
              正在直播中
            </View>
          )}
        </View>
        <View></View>
        {!param.classplanId ? (
          <Text className={styles.no_schedule}>该课程尚未排课，敬请期待</Text>
        ) : (
          <View className={styles.item_progress}>
            <View className={styles.progress_title}>
              <Text>阶段进度</Text>
              <View>
                <Image src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/star.png' />
                <Text className={styles.status_box}>
                  {numberFormat(doneProcessCount[0])}{' '}
                </Text>
                <Text className={styles.total_box}>
                  / {numberFormat(doneProcessCount[1])}
                </Text>
              </View>
            </View>
            <Progress
              percent={parseFloat(param.learningPro)}
              borderRadius={5}
              strokeWidth={9}
              active
              activeColor='#FEB219'
            />
          </View>
        )}
      </View>
    </View>
  );
}
export default RenderItem;
