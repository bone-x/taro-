import { View } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro'
import './index.scss';
import { AtMessage } from 'taro-ui'


// setTitle('登录')

class FormRule extends Component {
    constructor (arg) {
        super(arg)
        this.state.formData = Object.assign({}, this.props.formData)
    }
    // state = {
    //     formData: this.props.formData
    // }
    checkFilled () {
        const { formData } = this.state
        const { rule } = this.props
        let res = Object.entries(formData).filter(([key, item]) => (rule[key] && (rule[key].type || rule[key].require || rule[key].validate || rule[key].reg))).find(([key, item]) => {
            return !Boolean(item)
        })
        if (Boolean(res)) {
            return Promise.reject(res)
        } else {
            return Promise.resolve(true)
        }
    }
    checkRule(includeList = []) {
        const { formData } = this.state
        let { rule } = this.props
        rule = JSON.parse(JSON.stringify(rule))
        let newRule = {}
        if (includeList.length) {
            includeList.map(key => {
                newRule[key] = rule[key]
            })
            rule = newRule
        }
        let res = Object.entries(formData).filter(([key, item]) => (rule[key] && (rule[key].type || rule[key].require || rule[key].validate || rule[key].reg))).find(([key, item]) => {
            if (rule[key].require === true) {
                return !Boolean(item)
            } else {
                if (typeof rule[key].validate === 'function') {
                    return !rule[key].validate(item, formData)
                } else {
                    const reg = new RegExp(rule[key].reg)
                    return !reg.test(item)
                }
            }
        })
        if (res) {
            res = rule[res[0]]
            // Taro.atMessage({
            //     'message': res.msg,
            //     'type': 'error',
            // })
            return Promise.reject(res)
        } else {
            return Promise.resolve(true)
        }
    }
    add(key, value) {
        const { formData } = this.state
        formData[key] = value.detail.value
        this.setState({
            formData
        })
    }
    render() {
        const { children, check } = this.props
        const { formData } = this.state
        return (
            <View className='form_rule'>
                {this.props.children}
            </View>
        )
    }
}

export default FormRule
