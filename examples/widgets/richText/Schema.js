import { schema } from 'epage-core'

export default class RichTextSchema extends schema.FormSchema {
  constructor (props) {
    super()
    this.label = '富文本'
    this.placeholder = '请输入'
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(RichTextSchema, {
  title: '富文本',
  widget: 'richText',
  icon: 'compose',
  type: 'string',
  validators: [],
  logic: {
    value: ['=', '>', '<', '!='],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
