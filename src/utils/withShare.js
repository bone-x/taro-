/*
 * @Author: 邓达
 * @Description: 小程序分享功能实现
 * @props:
 * @event:
 * @Date: 2020-03-16 09:53:40
 * @LastEditors: 邓达
 * @LastEditTime: 2020-03-16 15:31:17
 */
import Taro from '@tarojs/taro';
import fetch from '@/api/request.js';

const app = Taro.getApp();

const defaultShareImg =
  'https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/kaoba/home.png';

function withShare(opts = {}) {
  // 设置默认
  const defalutPath = '/pages/index/index';
  const defalutTitle = '默认标题';
  const defaultImageUrl = defaultShareImg;

  return function demoComponent(Component) {
    class WithShare extends Component {
      async componentWillMount() {
        Taro.showShareMenu({
          withShareTicket: true
        });

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        let { title, imageUrl, path = null, carryId = false } = opts;

        // 从继承的组件获取配置
        if (this.$setSharePath && typeof this.$setSharePath === 'function') {
          path = this.$setSharePath();
        }

        // 从继承的组件获取配置
        if (this.$setShareTitle && typeof this.$setShareTitle === 'function') {
          title = this.$setShareTitle();
        }

        // 从继承的组件获取配置
        if (
          this.$setShareImageUrl &&
          typeof this.$setShareImageUrl === 'function'
        ) {
          imageUrl = this.$setShareImageUrl();
        }

        path = path ? path : defalutPath;

        let sharePath = path.indexOf('?') > -1 ? `${path}` : `${path}?`;

        if (carryId) {
          let { userInfo } = app.globalData;
          sharePath = userInfo.uid ? `${path}&uid=${userInfo.uid}` : `${path}`;
        }
        return {
          title: title || defalutTitle,
          path: sharePath,
          imageUrl: imageUrl || defaultImageUrl
        };
      }

      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}

export default withShare;
