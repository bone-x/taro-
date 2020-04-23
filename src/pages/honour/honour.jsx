import Taro, { Component } from "@tarojs/taro";
import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import style from "./honour.module.less";
import { AtFloatLayout } from 'taro-ui'
import fetch from '@/api/request.js'
import classNames from 'classnames'
import { connect } from '@tarojs/redux'
@connect(state => state.course)
class Honour extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [
        // { id: 0, title: "第一章 对外财务报告决策", type: 1 },
        // { id: 1, title: "系统学习", type: 1 },
        // { id: 2, title: "系统回顾", type: 0 },
        // { id: 3, title: "第一章 对外财务报告决策", type: 0 },
        // { id: 4, title: "全真拉练", type: 0 },
        // { id: 5, title: "全真拉练", type: 1 },
        // { id: 6, title: "全真拉练", type: 1 }
      ],
      honourData:{},
      honourNumber:0,
      isShowFiles:false,
    };
  }
  config = {
    navigationBarTitleText: "荣誉勋章",
    navigationBarBackgroundColor: "#13C799",
    navigationBarTextStyle: "white",
    navigationStyle: "default",
    backgroundTextStyle: "dark",
    backgroundColor: "#13C799",
    enablePullDownRefresh: false,
    disableScroll: false,
    onReachBottomDistance: 30
  };
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidMount() {
    this.getHonorMedalList();
  }

  componentDidHide() {}

  getHonorMedalList(){
    fetch("getHonourInfo", {
      courseId: this.props.courseDetail.courseId,
      classplanId:this.props.courseDetail.classplanId
    })
      .then((res) => {
        console.log(res);
        this.setState({
          honourData:res
        },()=>{this.handleHonourData(res.sectionListInfo)})
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleHonourData(data){
    let list = [], honourNumber=0;
    for(var i = 0;i < data.length;i++){
      let obj = {id: i, title: data[i].title, type: data[i].done?1:0};
      list.push(obj);
      if(data[i].done){
        honourNumber++;
      }
    }
    this.setState({list,honourNumber});
  }
  showFile=(data)=>{
    if(!data.receiveFlag){
      Taro.showToast({
        title: '点亮所有勋章后即可领取',
        icon: 'none',
        duration: 2000
      })
    }else{
      if(data.mixunFileList.length>0){
        this.setState({isShowFiles:true})
      }else{
        Taro.showToast({
          title: '此考霸抢分宝暂无文件',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
  downloadFile=(url)=>{
    Taro.showLoading({
      title: '文件读取中…'
    })
    console.log('url',url)
    Taro.downloadFile({
      url: url,
      // filePath: 'hq',
      filePath: '',
      complete: () =>　Taro.hideLoading(),
      fail: () =>{
        Taro.showToast({
          title: '下载失败',
          mask: true,
          icon: 'none'
        })
      },
      success: (res) => {
        console.log('res', res)
        Taro.openDocument({
          filePath: res.tempFilePath,
          success: (ress)=>{
            console.log('saveFile', ress)
          }
        }).catch(() => {
          Taro.showToast({
            title: '打开文件失败，不支持的文件格式',
            mask: true,
            icon: 'none'
          })
        })
      }
    })
  }
  handleClose = () => {
    this.setState({
      isShowFiles: false
    })
  }
  render() {
    const { list,honourData,honourNumber,isShowFiles } = this.state;
    var result = [];
    for (var i = 0, len = list.length; i < len; i += 6) {
      result.push(list.slice(i, i + 6));
    }

    return (
      <View className={style.container}>
        <View className={style.honour_header}>
        <View className={style.header_h1}>{honourNumber}</View>
          <View className={style.header_h2}>我点亮的徽章数</View>
          <View className={style.header_h3}>
            <Image className={style.header_img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/honour/bgc.png'/>
          </View>
        </View>
        <Swiper
          className={style.my_swiper}
          indicatorColor="#EBEFF2"
          indicatorActiveColor="#A3ABB8"
          indicatorDots
        >
          {result.map((item, index) => {
            return (
              <SwiperItem key={index}>
                <View className={style.honour_list}>
                  {item.map(data => {
                    return (
                      <View className={style.honour_item} key={data.id}>
                        {data.type == 0 && (
                          <Image
                            className={style.img}
                            src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/icon/honour/${data.id%5+1}-1.png`}
                          />
                        )}
                        {data.type == 1 && (
                          <Image
                            className={style.img}
                            src={`https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/icon/honour/${data.id%5+1}-2.png`}
                          />
                        )}
                        <View className={style.title}>{data.title}</View>
                        {/* <View className={style.title}>{data.title.slice(data.title.indexOf('章') + 1)}</View> */}
                      </View>
                    );
                  })}
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        <View
          className={classNames(style.honour_bottom, honourData.receiveFlag && style.active)}
          onClick={() =>this.showFile(honourData)}
          >{honourData.receiveFlag?"查看考霸抢分宝":"领取考霸抢分宝"}</View>
        <AtFloatLayout isOpened={isShowFiles} onClose={() => this.handleClose()}>
          <View className={style.showNote_header}>
            <View className={style.title}>查看文件</View>
            <View
              onClick={this.handleClose}
            >
              <Image className={style.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/close.png'></Image>
            </View>
          </View>
          {honourData.mixunFileList&&honourData.mixunFileList.map((item, index) => {
            return (
              <View className={style.noteList} key={index}>
                <View className={style.noteItem} onClick={() => this.downloadFile(item.fileUrl)}>
                  <Image className={style.img} src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/course/pdf.png'></Image>
                  <Text>{item.fileName}</Text>
                </View>
              </View>
            );
          })}
        </AtFloatLayout>
      </View>
    );
  }
}

export default Honour;
