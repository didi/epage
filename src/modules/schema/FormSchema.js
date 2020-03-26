import Schema from './Schema'
import {
  isNotEmptyString,
  isPlainObject,
  // isArray,
  // isNumber,
  // isFunction,
  // randomStr,
  // include,
  // jsonClone
  setKeyAndName,
  updateRequiredRule,
  getSchemaType
} from '../helper'

export default class FormSchema extends Schema {
  constructor (props) {
    const { schema } = props || {}
    super()
    this.name = ''
    this.type = getSchemaType(schema, new.target)
    this.label = ''
    this.description = ''
    this.help = ''
    this.disabled = false
    this.rules = [{ required: false, message: '必填', type: 'string', trigger: 'blur' }]

    // if (!this.widget) {
    //   this.widget = new.target
    //     ? new.target.widget
    //     : (schema ? schema.widget : '')
    // }
  }

  create (props) {
    const { schema, clone, widgets = {}, dynamic } = props || {}
    if (isPlainObject(schema) && isNotEmptyString(schema.widget)) {
      new Schema(props).create.call(this, props)
      if (clone && !dynamic) {
        this.name = this.key
      }
    }
    if (widgets[this.widget]) {
      updateRequiredRule(this, widgets[this.widget].Schema)
    }
    setKeyAndName(this)
    return this
  }

  updateRequiredRule (rule, Schema) {
    updateRequiredRule(this, Schema, rule)
  }
}
