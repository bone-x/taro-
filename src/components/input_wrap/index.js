import { Input, View } from '@tarojs/components';
import { Component } from '@tarojs/taro';
import './index.scss';


// setTitle('登录')

class InputWrap extends Component {
  render() {
    // // console.log('hasRight', this.props)
    // const leftSide = <Input type={this.props.type} placeholder={this.props.placeholder}></Input>
    // this.props.onInput && (leftSide.props.onInput = this.props.onInput)
    return (
      <View className='input_wrap'>
        <View className='at-row at-row__justify--between at-row__align--center'>
          <View className='at-col at-col-8'>
            <Input type={this.props.type} placeholder={this.props.placeholder} onInput={this.props.onInput}></Input>
          </View>
          {this.props.hasRight ? <View className={['at-col at-col-1 at-col--auto', 'right_side']}>
            {this.props.children}
          </View> : ''}
        </View>
      </View>
    )
  }
}

export default InputWrap
