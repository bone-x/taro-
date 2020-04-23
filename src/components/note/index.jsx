import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import style from './index.module.less';
import './modify.scss';
import fetch from '@/api/request';
import { ossSign, upload } from '@/utils/upload';
import {
  AtFloatLayout,
  AtTextarea,
  AtModal,
  // AtCurtain,
  AtToast,
  AtButton
  // AtActivityIndicator
} from 'taro-ui';

const app = Taro.getApp();
// import Loading from '@/components/loading'
let saveNoteItem = {};
// 时间戳转换
function add0(m) {
  return m < 10 ? '0' + m : m;
}
function timeFormat(timestamp) {
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  return (
    year +
    '-' +
    add0(month) +
    '-' +
    add0(date) +
    ' ' +
    add0(hours) +
    ':' +
    add0(minutes) +
    ':' +
    add0(seconds)
  );
}
//笔记列表进行排序
function compare(property) {
  return function(a, b) {
    return b[property] - a[property];
  };
}

class Note extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor() {
    super(...arguments);
    this.state = {
      noteList: [],
      showDel: false,
      showDel: false,
      showNote: false,
      showCurtain: false,
      showToast: false,
      topicType: 10,
      id: '',
      value: '',
      url: '',
      file: null
    };
  }

  componentWillMount() {
    this.getNoteList();
  }

  componentDidMount() {
    // const query = Taro.createSelectorQuery()
    //   .select(".myat")
    //   .boundingClientRect();
    // query.exec(res => {
    //   console.log(res, "modal");
    // });
    // console.log(Taro.getEnv())
    // console.log(Taro.ENV_TYPE)
    // this.props.onRef(this)
  }
  //获取笔记列表数据
  getNoteList() {
    fetch('queryLiveNotes', {
      classplanId: app.globalData.liveData.classplanId,
      SSOTOKEN: Taro.getStorageSync('token')
    }).then(res => {
        if (res.length > 0) {
         const temp =  res.filter(item => item.classplanLiveId == app.globalData.liveData.classplanLiveId)
         this.setState({
           noteList: temp.length>0 ? temp[0].notes : temp
            })
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  //保存编辑笔记
  saveOrUpdate() {
    Taro.showLoading({ title: '保存中', mask: true });
    fetch('saveOrUpdate', {
      ...(this.state.id ? { id: this.state.id } : {}),
      content: this.state.value,
      topic: app.globalData.liveData.classplanLiveId,
      topicType: this.state.topicType,
      url: this.state.url,
      SSOTOKEN: Taro.getStorageSync('token')
    })
      .then(res => {
        Taro.hideLoading();
        this.getNoteList();
      })
      .catch(error => {
        console.error();
      });
  }
  //点击确定保存
  saveNote() {
    const { url, file, value} = this.state;
    if(url =='' && value.trim()==''){
      Taro.showToast({ title: '请输入文字或者上传图片', icon: 'none', duration:1000 });
      return false
    }
    if (url && url !== saveNoteItem.url) {
      //小程序上传图片
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const splitUrl = String(file.path).split('/');
        const fileName = splitUrl[splitUrl.length - 1];
        console.log('fileName', fileName);
        // 获取图片签名
        Taro.showLoading({ title: '上传中', mask: true });
        ossSign({ key: fileName })
          .then(signRes => {
            if (signRes.statusCode !== 200) {
              Taro.showToast({ title: '网络异常', icon: 'none' });
              console.error('oss 签名出错', file);
              return false;
            }
            const signObj = signRes.data.data;
            console.log(signObj);
            // 上传
            Taro.uploadFile({
              url: signObj.host,
              filePath: file.path,
              name: 'file',
              header: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Content-Type': 'multipart/form-data'
              },
              formData: {
                key: `${signObj.dir}${fileName}`,
                policy: signObj.policy,
                OSSAccessKeyId: signObj.accessid,
                success_action_status: 200,
                signature: signObj.signature,
                callback: signObj.callback
              }
            })
              .then(() => {
                Taro.hideLoading();
                // 上传成功
                this.setState(
                  {
                    url: signObj.url
                  },
                  () => {
                    this.saveOrUpdate(saveNoteItem);
                    this.setState({
                      showNote: false,
                      id: '',
                      url: '',
                      file: null
                    });
                  }
                );
              })
              .catch(() => {
                Taro.hideLoading();
                console.error('上传到oss出错', file);
              });
            console.log(signObj);
          })
          .catch(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '网络异常', icon: 'none' });
            console.error('oss 签名出错', file);
          });
      } else {
        //h5上传图片
        const fileName = file.name;
        console.log(file);
        // 获取图片签名
        Taro.showLoading({ title: '上传中', mask: true });
        ossSign({ key: fileName })
          .then(signRes => {
            if (signRes.statusCode !== 200) {
              Taro.showToast({ title: '网络异常', icon: 'none' });
              console.error('oss 签名出错', file);
              return false;
            }
            const signObj = signRes.data;
            console.log(signObj);
            upload(signObj, file)
              .then(() => {
                Taro.hideLoading();
                // 上传成功
                this.setState(
                  {
                    url: signObj.url
                  },
                  () => {
                    this.saveOrUpdate(saveNoteItem);
                    this.setState({
                      showNote: false,
                      id: '',
                      url: '',
                      file: null
                    });
                  }
                );
              })
              .catch(error => {
                Taro.hideLoading();
                console.error('上传到oss出错', error);
              });
          })
          .catch(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '网络异常', icon: 'none' });
            console.error('oss 签名出错', file);
          });
      }
    } else {
        this.saveOrUpdate(saveNoteItem);
        // this.setState({
        //   id: '',
        //   url: '',
        //   file: null
        // });
      this.handleClose()
    }
  }
  //删除笔记
  getDeleteNote = id => {
    fetch('getDeleteNote', {
      ids: id
    })
      .then(res => {
        this.getNoteList();
        Taro.showToast({ title: '删除成功', icon: 'success' });
      })
      .catch(error => {
        console.error();
      });
  };
  //监听文本框
  handleChange = event => {
    // if (event.target.value.trim().length > 200) {
    //   this.setState({
    //     showToast: true
    //   });
    //   return false
    // } else {
    //   this.setState({
    //     showToast: false
    //   });
    // }
    this.setState({
      value: event.target.value
    });
  };
  //点击记笔记
  //编辑保存笔记弹层
  //编辑保存笔记弹层
  handleShowNote = item => {
    if (item && (item.content || item.url)) {
      saveNoteItem = JSON.parse(JSON.stringify(item));
      this.setState({
        id: item.id,
        showNote: true,
        url: item.url,
        value: item.content
      });
    } else {
      this.setState({
        showNote: true,
        id: '',
        value: '',
        url: ''
      });
    }
  };
  //点击删除笔记
  handleShowModel = id => {
    console.log(id);
    this.setState({
      showDel: true,
      id
    });
  };
  //点击关闭
  handleClose() {
    this.setState({
      showDel: false,
      showNote: false,
      value: '',
      file: null,
      url: '',
      id: '',
      showToast: false
    });
  }
  //点击弹窗确定删除笔记
  handleConfirm = id => {
    this.getDeleteNote(id);
    this.setState({
      showDel: false,
      id: ''
    });
  };
  //弹窗点击取消
  handleCancel() {
    this.setState({
      showDel: false,
      id: ''
    });
  }
  //点击看大图
  handleImage = url => {
    this.setState({ url }, () => {
      Taro.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      });
    });
  };
  //看大图点击关闭图片
  closeImage() {
    this.setState({
      showCurtain: false,
      url: ''
    });
  }
  //点击删除预览图
  delImage() {
    this.setState({
      url: ''
    });
  }
  //小程序点击选择图片
  handleImageUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      const file = res.tempFiles[0];
      console.log('file是', file);
      console.log('res是', res);
      if (!file) return false;
      this.setState({
        file,
        url: file.path
      });
      const fileStr = String(file.path).split('.');
      console.log('fileStr', fileStr);
      const fileType = fileStr[fileStr.length - 1];
      console.log(fileType);
      const fileSize = Number(file.size) / 1024 / 1024;
      //对文件类型检查
      const imgStr = /(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG)$/;
      if (!imgStr.test(fileType)) {
        Taro.showToast({
          title: '不支持此格式',
          icon: 'none'
          // image: errorImg
        });
        this.setState({
          url: ''
        });
        return false;
      }
      // 文件大小检查
      if (fileSize > 5) {
        Taro.showToast({ title: '图片大小超过5M', image: errorImg });
        this.setState({
          url: ''
        });
        return false;
      }
    });
  };
  render() {
    const {
      noteList,
      showNote,
      showDel,
      showToast,
      url,
      id
    } = this.state;
    const { isActive } = this.props;
    return (
      <View className={style.note_container}>
        {!noteList || noteList.length === 0 ? (
          <View className={style.empty}>
            <View className={style.empty_img}>
              <Image
                className={style.img}
                src='https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/empty.png'
              />
            </View>
            <View className={style.empty_info}>很遗憾,没有记录笔记</View>
          </View>
        ) : (
          noteList.sort(compare('createTime')).map(item => {
            return (
              <View className={style.note_list} key={item.id}>
                <View className={style.note_tabs}>
                  <View className={style.ball}></View>
                  <Text className={style.note_date}>
                    {timeFormat(item.createTime)}
                  </Text>
                  <View className={style.note_option}>
                    <View
                      className={style.note_edit}
                      onClick={() => this.handleShowNote(item)}
                    >
                      <Text className={`iconfont ${style.iconbianji}`}>
                        &#xe627;
                      </Text>
                      <Text className={style.editText}>编辑</Text>
                    </View>
                    <View
                      className={style.note_del}
                      onClick={() => this.handleShowModel(item.id)}
                    >
                      <Text className={`iconfont ${style.iconshanchu1}`}>
                        &#xe608;
                      </Text>
                      <Text className={style.delText}>删除</Text>
                    </View>
                  </View>
                </View>
                <View className={style.note_des}>
                  <Text className={style.note_info}>{item.content}</Text>
                  {item.url ? (
                    <Image
                      onClick={() => this.handleImage(item.url)}
                      className={style.note_image}
                      mode='aspectFit'
                      src={item.url}
                    />
                  ) : null}
                </View>
              </View>
            );
          })
        )}
        {isActive && (
          <View
            className={style.write_note}
            onClick={() => this.handleShowNote()}
          >
            <Text className={`iconfont ${style.iconbi}`}>&#xe62b;</Text>记笔记
          </View>
        )}
        <AtFloatLayout
          isOpened={showNote}
          onClose={() => this.handleClose()}
          className='myat'
        >
          <View className={style.showNote_header}>
            <View className={style.title}>编辑笔记</View>
            <View
              className={`iconfont ${style.iconguanbi}`}
              onClick={this.handleClose}
            >
              &#xe609;
            </View>
          </View>
          {showNote&&<AtTextarea
            value={this.state.value}
            onChange={this.handleChange}
            maxLength={200}
            height={270}
            cursorSpacing={263}
            textOverflowForbidden
            placeholder='请输入笔记内容...'
            placeholderStyle='font-size:30rpx;
                        font-family:PingFang SC;
                        line-height:40rpx;
                        font-weight:400;
                        color:#A3ABB8;'
          />
  }
          {/* <AtToast isOpened={showToast} text='请不要超过200字' /> */}
          <View>
            {url ? (
              <View className='img_box'>
                <Image className='upload_img' src={url} />
                <Text
                  onClick={this.delImage}
                  className='iconfont iconxianshi_quxiaotianchong'
                >
                  &#xe620;
                </Text>
              </View>
            ) : (
              <View
                onClick={this.handleImageUpload}
                className='uploadImage_box'
              />
            )}
          </View>
          <Button
            onClick={this.saveNote}
            className='save_weapp'
          >
            提交
          </Button>
        </AtFloatLayout>
        <AtModal
          isOpened={showDel}
          title='提示'
          cancelText='取消'
          confirmText='确认'
          onClose={() => this.handleClose()}
          onCancel={() => this.handleCancel()}
          onConfirm={() => this.handleConfirm(id)}
          content='确定删除本条笔记吗？'
        />
      </View>
    );
  }
}
export default Note;
