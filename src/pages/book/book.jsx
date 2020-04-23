import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import BookTask from '@/components/book_task';
import { connect } from '@tarojs/redux';
import fetch from '@/api/request.js';
// import { changeBookId } from '../../actions/book';
import style from './book.module.less';
import { CLIEngine } from 'eslint';

@connect(({ course }) => ({
  course
}))
class Book extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      bookId: '',
      faviconList: []
    };
  }

  componentWillMount() {
    const id = this.$router.params.id * 1;
    Taro.setNavigationBarTitle({
      title: id === 1 ? '错题本' : '收藏本'
    });
    this.setState({
      bookId: id
    });
    // this.props.changeBookId(id)
  }
  componentDidMount() {
    if (this.state.bookId === 1) {
      this.getErrorTitleList();
    } else {
      this.getLoadFavoritesList();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '错题本',
    navigationBarBackgroundColor: '#13C799',
    navigationBarTextStyle: 'white'
  };

  getErrorTitleList() {
    fetch('getErrorSubjectList').then(res => {
      this.setState({
        faviconList: res
      });
    });
  }

  getLoadFavoritesList() {
    let params = {
      courseCode: this.props.course.courseInfo.courseNo
    };
    // =&limit=10&page=1
    fetch('getLoadFavorites', params).then(res => {
      this.setState({
        faviconList: res
      });
    });
  }

  goTo = () => {
    Taro.navigateTo({
      url: `/pages/Test/testHomeWork/index?isRedo=${
        this.state.bookId === 1 ? true : false
      }`
    });
  };

  render() {
    const { bookId, faviconList } = this.state;

    return (
      <View className={style.book_container}>
        <ScrollView scrollY style='height: 100%'>
          {faviconList.map((item, i) => {
            return <BookTask topicTypeList={item} bookId={bookId} key={i} />;
          })}
          <View className={style.zipper}>
            <View className={style.zipper_title}>
              <View className={style.title_left}>仿真拉练</View>
              <View className={style.title_right}>
                <View className={style.info}>共140题</View>
                <View className={style.right_button} onClick={this.goTo}>
                  <View className={style.button_sec}>
                    {bookId == 1 ? '重做' : '答题'}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// pages/book/book

export default Book;
