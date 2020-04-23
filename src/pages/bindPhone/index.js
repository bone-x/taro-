import Taro, { Component } from '@tarojs/taro';
import { View, Button, Input, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtMessage } from 'taro-ui';
import Register from '@/components/register';
import InputWrap from '@/components/input_wrap';
import FormRule from '@/components/Form_rule';
// import fetch from "@/api/request";
import { Base64 } from 'js-base64';
import { dispatchLogin } from '../../actions/login';
// import weixin from '../../resources/images/weixin.png';
import './index.less';

@connect(state => state.loginReducer, { dispatchLogin })
class bindPhone extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      loading: false,
      actived: {
        validate: false
      },
      hash: 0,
      count: 0,
      formData: {
        mobileNo: null,
        passWord: null,
        otp: null,
        // firstpassWord: null,
        captchaCode: null
      },
      rule: {
        mobileNo: {
          reg: '^1[3456789]\\d{9}$',
          msg: '手机号错误'
        },
        passWord: {
          require: true,
          msg: '请输入密码'
        }
      },
      actived_bindPhone: false,
      currentTab: 1 // 1 表示登录 2 表示注册
    };
  }

  componentWillMount() {
    let ty = '';
    ty = this.$router.params.type == '2' ? 2 : 1;
    this.setState({
      currentTab: ty
    });
  }

  config = {
    navigationBarTitleText: '登录'
  };

  doBindPhone = () => {
    // if (!this.state.actived_bindPhone) return false
    let { formData } = this.refs.validate.state;
    let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!formData.mobileNo) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (!formData.password) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (!reg.test(formData.mobileNo)) {
      Taro.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    formData = JSON.parse(JSON.stringify(formData));
    formData.passWord = Base64.encode(formData.password);
    delete formData.password;
    this.setState({
      loading: true
    });
    this.props
      .dispatchLogin(formData)
      .then(res => {
        this.setState({
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
        this.doBindPhone(); //不懂为啥要重新调用
      });
  };
  addInput(value, key, cate = 'validate') {
    this.refs[cate].add(key, value);
    if (
      this.refs.validate.state.formData.mobileNo &&
      this.refs.validate.state.formData.mobileNo.length > 10 &&
      this.refs.validate.state.formData.password &&
      this.refs.validate.state.formData.password.length > 5
    ) {
      this.setState({
        actived_bindPhone: true
      });
    } else {
      this.setState({
        actived_bindPhone: false
      });
    }
  }
  toFindPass = () => {
    Taro.navigateTo({
      url: '/personCenter/pages/personalCenter/findPassword/index'
    });
  };
  // 授权问题，如果授权了就直接登录，如果没有授权就进行授权
  tobegin(e) {
    if (e.detail.userInfo) {
      Taro.navigateTo({
        url: '/personCenter/pages/personalCenter/wxLogin/index'
      });
    } else {
      console.log(false);
    }
  }

  // 登录界面
  handleLogBtn() {
    this.setState({
      currentTab: 1
    });
  }

  // 注册界面
  handleRegBtn() {
    this.setState({
      currentTab: 2
    });
  }

  render() {
    let { currentTab } = this.state;
    return (
      <View className='bindPhone'>
        {/* tab栏切换 */}
        <View className='tabBar'>
          <View className='logBtn'>
            <Text
              className={currentTab == 1 ? 'checked' : ''}
              onClick={this.handleLogBtn}
            >
              登录
            </Text>
          </View>
          <View className='regBtn'>
            <Text
              className={currentTab == 2 ? 'checked' : ''}
              onClick={this.handleRegBtn}
            >
              注册
            </Text>
          </View>
        </View>

        {currentTab == 1 ? (
          <View className='bindBox'>
            <FormRule
              formData={this.state.formData}
              rule={this.state.rule}
              ref='validate'
            >
              <InputWrap
                onInput={value =>
                  this.addInput.apply(this, [value, 'mobileNo'])
                }
                placeholder='请输入手机号码'
              />
              <InputWrap
                onInput={value =>
                  this.addInput.apply(this, [value, 'password'])
                }
                placeholder='输入密码，长度为6-16位'
                type='password'
              />
              {/* <InputWrap 
                onInput={(value) => this.addInput.apply(this, [value, 'passWord'])}
              placeholder='确认密码' type='password'></InputWrap> */}
            </FormRule>

            <Button
              loading={this.state.loading}
              open-type='getUserInfo'
              className={[
                'button_sure',
                this.state.actived_bindPhone ? 'avtive' : ''
              ]}
              onClick={this.doBindPhone}
            >
              登录
            </Button>

            <View className='at-row at-row__justify--between'>
              <View className='at-col at-col-12'>
                <Text
                  className={['subscript', 'rightSide']}
                  onClick={this.toFindPass}
                >
                  忘记密码？
                </Text>
              </View>
            </View>
            <AtMessage />
          </View>
        ) : (
          <Register></Register>
        )}
      </View>
    );
  }
}

export default bindPhone;
