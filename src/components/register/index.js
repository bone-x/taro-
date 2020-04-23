import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtButton, AtMessage } from 'taro-ui';
import './index.scss';
import InputWrap from '@/components/input_wrap';
import FormRule from '@/components/Form_rule';
import fetch from '@/api/request';
// import URI from 'urijs'
import { Base64 } from 'js-base64';
// import { getCookie } from '@/utils/timeFormat.js'
import { change } from '@/actions/agreement';

//img
import xuanzhong1 from './img/xuanzhong1.png';
import weixuanzhong from './img/weixuanzhong.png';
// import arrow_img from './img/arrow.png'
// import app from '../../../dist/app';

const app1 = Taro.getApp();
let hasSendSMS = false;
function validateRepeat(item, formData) {
  return Boolean(item === formData.passWord);
}

@connect(
  ({ agreement }) => ({
    isFocus: agreement.saw
  }),
  dispatch => ({
    change(status) {
      dispatch(change(status));
    }
  })
)
class Register extends Component {
  constructor(props) {
    super(props);
    this.passwordLengthLimit = 6;
  }
  config = {
    navigationBarTitleText: '注册'
  };

  state = {
    actived: {
      validate: false
    },
    hash: 0,
    count: 0,
    captchaCode: null,
    serverPath: app1.globalData.serverPath,
    formData: {
      mobileNo: null, // 手机号码
      passWord: null, // 确认验证码
      otp: null, // 短信验证码
      firstpassWord: null, // 密码
      captchaCode: null // 图片验证码
    },
    rule: {
      mobileNo: {
        reg: '^1[3456789]\\d{9}$',
        msg: '手机号错误'
      },
      otp: {
        require: true,
        msg: '请输入短信验证码'
      },
      captchaCode: {
        require: true,
        msg: '请输入图形验证码'
      },
      passWord: {
        reg: `^\\w{6,16}$`,
        msg: '请输入6-16位密码'
      }
    },
    actived_register: false,
    loading: false,
    actived_send: false
  };
  //   getSmS
  // validateSmS
  componentWillMount() {
    console.log(Taro.getEnv(), Taro.ENV_TYPE.WEB, '111111111');
    // if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    //   if (window.location.href.indexOf('isAgree') > -1) {
    //     this.changeFocus()
    //   }
    //   if (
    //     window.location.href.indexOf('regPhone') > -1 ||
    //     window.location.href.indexOf('regCode') > -1
    //   ) {
    //     let obj = URI(window.location.href).search(true)
    //     this.setState({
    //       formData: {
    //         mobileNo: obj.regPhone,
    //         otp: obj.regCode
    //       }
    //     })
    //   }
    // }
  }

  // 注册函数
  doRegister() {
    if (!this.props.isFocus) {
      Taro.showToast({
        title: '请阅读并同意协议',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!this.refs.validate.state.formData.mobileNo) {
      Taro.showToast({
        icon: 'none',
        title: '请输入手机号',
        duration: 2000
      });
      return;
    }
    if (!this.refs.validate.state.formData.captchaCode) {
      Taro.showToast({
        icon: 'none',
        title: '请输入图片验证码',
        duration: 2000
      });
      return;
    }
    if (!this.refs.validate.state.formData.otp) {
      Taro.showToast({
        icon: 'none',
        title: '请输入短信验证码',
        duration: 2000
      });
      return;
    }
    if (!this.refs.validate.state.formData.firstpassWord) {
      Taro.showToast({
        icon: 'none',
        title: '请输入密码',
        duration: 2000
      });
      return;
    }
    if (
      this.refs.validate.state.formData.passWord !=
      this.refs.validate.state.formData.firstpassWord
    ) {
      Taro.showToast({
        icon: 'none',
        title: '密码不一致，请重新输入',
        duration: 2000
      });
      return;
    }

    let { formData } = this.refs.validate.state;
    formData = JSON.parse(JSON.stringify(formData));
    formData.passWord = Base64.encode(formData.passWord);
    this.setState({
      loading: true
    });
    formData.clientType = 'mp';

    return fetch('register', {
      mobileNo: formData.mobileNo,
      otp: formData.otp,
      clientType: 'mp',
      channelType: 'kaoba',
      redirectUrl: '/',
      passWord: formData.passWord
    })
      .then(res => {
        Taro.setStorageSync('token', res.token);
        Taro.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000
        });
        this.setState(
          {
            loading: false
          },
          () => {
            setTimeout(() => {
              Taro.redirectTo({
                url: '/pages/bindPhone/index'
              });
            }, 2000);
          }
        );
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  }

  // 选择问题
  changeFocus() {
    let status = !this.props.isFocus;
    this.props.change(status);
  }

  // 输入函数
  addInput(value, key, cate = 'validate') {
    let { actived } = this.state;
    this.refs[cate].add(key, value);
    if (
      this.refs.validate.state.formData.mobileNo &&
      this.refs.validate.state.formData.otp &&
      this.refs.validate.state.formData.captchaCode
    ) {
      this.setState({
        actived_register: true
      });
    } else {
      this.setState({
        actived_register: false
      });
    }
  }

  // toRegister() {
  //   Taro.navigateTo({
  //     url: '/personCenter/pages/personalCenter/register/index', // 注册
  //   })
  // }

  // goLogin() {
  //   if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  //     Taro.navigateTo({
  //       url: '/pages/bindPhone/index'
  //     })
  //   }
  //   Taro.navigateTo({
  //     url: '/pages/bindPhone/index'
  //   })
  // }

  // 阅读协议
  goAgreement() {
    Taro.navigateTo({
      url: '/personCenter/pages/personalCenter/signLog/index'
    });
  }

  // 获取短信验证码倒计时
  sendSMS() {
    if (this.state.count) {
      return;
    }
    this.setState({
      actived_send: true
    });
    hasSendSMS = true;
    this.setState({
      count: 60,
      hash: Date.parse(new Date())
    });
    const countdown = setInterval(() => {
      let now = this.state.count - 1;
      this.setState({
        count: now
      });
      if (now <= 0) {
        clearInterval(countdown);
      }
    }, 1000);
    const { formData } = this.refs.validate.state;
    // 干正事
    fetch('getSmS', {
      mobileNo: formData.mobileNo,
      captchaCode: formData.captchaCode,
      type: 1
    })
      .then(() => {})
      .catch(res => {
        this.getCatpcha();
        this.setState({
          actived_send: false
        });
        this.setState({
          count: 0
        });
        clearInterval(countdown);
        Taro.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        });
      });
  }

  componentDidMount() {
    this.getCatpcha();
  }

  getCatpcha() {
    fetch('getCaptcha', {
      hash: Date.parse(new Date())
    }).then(res => {
      const base64Data = Taro.arrayBufferToBase64(res.data);
      this.setState({
        captchaCode: `data:image/jpeg;base64,${base64Data}`
      });
    });
  }

  render() {
    return (
      <View className='register'>
        <FormRule
          formData={this.state.formData}
          rule={this.state.rule}
          ref='validate'
        >
          <InputWrap
            onInput={value => this.addInput.apply(this, [value, 'mobileNo'])}
            placeholder='请输入手机号码'
          />
          <InputWrap
            placeholder='请填写图形验证码'
            hasRight
            onInput={value => this.addInput.apply(this, [value, 'captchaCode'])}
          >
            <View onClick={this.getCatpcha.bind(this)}>
              <Image className='taro_img' src={this.state.captchaCode} />
            </View>
          </InputWrap>
          <InputWrap
            onInput={value => this.addInput.apply(this, [value, 'otp'])}
            placeholder='短信验证码'
            hasRight
          >
            <View
              className={[
                'button_send',
                this.state.actived_send && this.state.count ? 'avtive' : ''
              ]}
              onClick={this.sendSMS.bind(this)}
            >
              {this.state.count || `获取验证码`}
            </View>
          </InputWrap>
          <InputWrap
            onInput={value =>
              this.addInput.apply(this, [value, 'firstpassWord'])
            }
            placeholder='输入密码，长度为6-16位'
            type='password'
          />
          <InputWrap
            onInput={value => this.addInput.apply(this, [value, 'passWord'])}
            placeholder='确认密码'
            type='password'
          />
        </FormRule>
        <Button
          type='primary'
          loading={this.state.loading}
          className={[
            'button_sure',
            this.state.actived_register && this.props.isFocus ? 'avtive' : ''
          ]}
          onClick={this.doRegister.bind(this)}
        >
          注册
        </Button>
        <View className='contract'>
          <Image
            className='image'
            src={this.props.isFocus ? xuanzhong1 : weixuanzhong}
            onClick={this.changeFocus.bind(this)}
          />
          <Text onClick={this.changeFocus.bind(this)}>
            注册即代表您已阅读并且同意{' '}
          </Text>
          <Text className='agree' onClick={this.goAgreement.bind(this)}>
            服务协议
          </Text>
        </View>
        {/* <View onClick={this.goLogin} className='login'>
          已注册或有恒企账号 马上登陆{' '}
          <Image className='image' src={arrow_img} />
        </View> */}
        <AtMessage />
      </View>
    );
  }
}

export default Register;
