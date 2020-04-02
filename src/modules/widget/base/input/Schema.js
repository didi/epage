import { FormSchema } from '../../../schema'

export default class InputSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '输入框'
    this.placeholder = '请输入'
    this.option = {
      password: false,
      prefix: '', // 前缀字符
      suffix: '' // 后缀字符
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(InputSchema, {
  title: '单行文本',
  widget: 'input',
  icon: 'edit',
  type: 'string',
  validators: ['string', 'email', 'url', 'pattern'],
  logic: {
    value: ['=', '!=', '<>', '><'],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
