import Schema from '../../../../modules/schema'

export default class TextareaSchema extends Schema {
  constructor (props) {
    super()
    this.title = '输入框'
    this.placeholder = '请输入'
    this.option = {
      rows: 3
    }
    this.$init(props)
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
