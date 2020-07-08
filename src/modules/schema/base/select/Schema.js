import FormSchema from '../../FormSchema'
import { getRuleValidator } from '../../../helper'

export default class SelectSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '下拉框'
    this.placeholder = '请选择'
    this.rules = [{
      required: false,
      message: '必填',
      trigger: 'change'
    }]
    this.option = {
      type: 'static',
      url: '',
      adapter: 'return data',
      dynamicData: [],
      data: [
        { key: 'A', value: 'A' },
        { key: 'B', value: 'B' }
      ],
      multiple: false,
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
Object.assign(SelectSchema, {
  title: '下拉框',
  widget: 'select',
  icon: 'ios-arrow-down',
  type: ['string', 'number', 'array', 'array<string>', 'array<number>'],
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
