import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import fetch from '@/api/request.js';
import style from './zipper.module.less';
import { connect } from '@tarojs/redux'
@connect(state => state.course)
class Zipper extends Component {
	constructor() {
		super(...arguments)
		this.state = {
			list: [
				{ id: 0, title: '仿真测试一', type: 0 },
				{ id: 1, title: '仿真测试二', type: 1 },
				{ id: 2, title: '仿真测试三', type: 2 },
			],
			testData:[]
		}
	}
	config = {
		navigationBarTitleText: '仿真拉练',
		navigationBarBackgroundColor: '#13C799',
		navigationBarTextStyle: "white",
	}
	componentDidMount() {
		this.getPracticeData();
	}

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidShow() {}

  componentDidHide() {}

  getPracticeData() {
    fetch('getPracticeInfo', {
			examType: '10',
			courseCode: this.props.courseInfo.courseNo
    })
      .then(res => {
        console.log(res);
        this.setState({ testData: res });
      })
      .catch(error => {
        console.log(error);
      });
	}
	formatDate(data) {
		let newT = data.replace(/-/g, '/');
		if(!data){
			var date = new Date();
		}else{
			var date = new Date(newT);
		}
    var y = date.getFullYear();
    var m = date.getMonth() + 1;  
    m = m < 10 ? '0' + m : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    return y + '.' + m + '.' + d;  
};  
	render() {
		const { list,testData } = this.state
		return (
			<View className={style.zipper_container}>
				<ScrollView scrollY style='height: 100%'>
					{testData.map(item => {
						return (
							// 过期的还没做的测试隐藏
							!(item.status != 7 && Date.parse(item.endTime.replace(/-/g, '/')) < Date.parse(new Date())) &&
							<View className={style.zipper_task} key={item.examId}>
								<View className={style.task_content}>
									<View className={style.content_left}>
										<View className={style.left_title}>{item.examName}</View>
										<View className={style.left_sec} style={{ marginBottom: '6px;' }}>测试时长：{item.examTime?item.examTime:0}分钟   总分数：{item.paperScore?item.paperScore:0}分</View>
						<View className={style.left_sec}>考试时间：{this.formatDate(item.startTime)} - {this.formatDate(item.endTime)}</View>
									</View>
									<View className={style.content_right}>
										{item.status == 2 &&
											<View className={`${style.right_button} ${style.button0}`} onClick={()=>{Taro.navigateTo({url: "/pages/Test/testHomeWork/index?examId="+item.examId})}}>
												<View className={style.button_sec}>继续测试</View>
											</View>
										}
										{item.status == 1 &&
											<View className={`${style.right_button} ${style.button1}`} onClick={()=>{Taro.navigateTo({url: "/pages/Test/testHomeWork/index?examId="+item.examId})}}>
												<View className={style.button_sec}>开始测试</View>
											</View>
										}
										{item.status == 7 &&
											<View className={`${style.right_button} ${style.button2}`} onClick={()=>{Taro.navigateTo({url: "/pages/Test/testResult/index?recordId="+item.recordId})}}>
												<View className={style.button_sec} style={{ color: '#13C799;' }}>查看结果</View>
											</View>
										}
									</View>
								</View>
							</View>
						)
					})}
				</ScrollView>
			</View>
		);
	}
}

export default Zipper;
