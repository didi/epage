import { FormSchema } from '../../../schema'

export default class TextareaSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '多行文本'
    this.placeholder = '请输入'
    this.option = {
      rows: 3
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(TextareaSchema, {
  title: '多行文本',
  widget: 'textarea',
  icon: 'compose',
  type: 'string',
  validators: ['string', 'email', 'url', 'pattern'],
  logic: {
    value: ['=', '!=', '<>', '><'],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
