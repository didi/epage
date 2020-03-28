import Schema from './BaseSchema'
import {
  setKeyAndName,
  updateRequiredRule,
  getSchemaType
} from '../helper'

export default class FormSchema extends Schema {
  constructor (props) {
    const { schema, widgets = {} } = props || {}
    super()
    // form name
    this.name = ''
    // type of widget value
    this.type = getSchemaType(schema, new.target)
    // label name
    this.label = ''
    this.description = ''
    this.help = ''
    this.disabled = false
    // 校验规则，参考 [async-validator](https://github.com/yiminghe/async-validator)
    this.rules = [{
      required: false,
      message: '必填',
      type: 'string',
      trigger: 'blur'
    }]
    this.create(props)

    if (widgets[this.widget]) {
      updateRequiredRule(this, widgets[this.widget].Schema)
    }
  }

  // over write the base Schema method
  create (props) {
    const { clone, dynamic } = props || {}
    Schema.prototype.create.call(this, props)
    setKeyAndName(this, clone, dynamic)
  }

  updateRequiredRule (rule, Schema) {
    updateRequiredRule(this, Schema, rule)
  }
}
