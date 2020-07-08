import FormSchema from '../../FormSchema'
import { getRuleValidator } from '../../../helper'

export default class RadioSchema extends FormSchema {
  constructor (props) {
    super()
    this.type = 'string'
    this.label = '单选框'
    this.placeholder = '请选择'
    this.option = {
      type: 'static',
      direction: 'horizontal',
      url: '',
      adapter: 'return data',
      data: [
        { key: 'A', value: 'A' }
      ],
      dynamicData: []
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
Object.assign(RadioSchema, {
  title: '单选框',
  widget: 'radio',
  icon: 'android-radio-button-on',
  type: ['string', 'number'],
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['change']
    event: []
  }
})
