import { FormSchema } from '../../../schema'
import { getRuleValidator } from '../../../helper'

export default class AutoCompleteSchema extends FormSchema {
  constructor (props) {
    super()
    this.type = 'string'
    this.label = '自动完成'
    this.widget = 'autoComplete'
    this.placeholder = '请输入'
    this.option = {
      type: 'static',
      url: '',
      adapter: '',
      data: ['A'],
      dynamicData: [],
      clearable: true
    }
    this.create(props)
    const rule = {
      trigger: 'change',
      validator: getRuleValidator(this.rules[0], this.type)
    }
    this.updateRequiredRule(rule, new.target)
  }
}

// 静态配置，同类widget公有
Object.assign(AutoCompleteSchema, {
  title: '自动完成',
  widget: 'autoComplete',
  icon: 'ios-list-outline',
  type: 'string',
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
