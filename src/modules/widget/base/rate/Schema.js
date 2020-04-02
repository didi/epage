import { FormSchema } from '../../../schema'

export default class RateSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '评分'
    this.rules = [{ required: false, message: '必填', min: 0, type: 'number' }]
    this.option = {
      count: 5,
      allowHalf: false,
      showText: false
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(RateSchema, {
  title: '评分',
  widget: 'rate',
  icon: 'ios-star',
  type: 'number',
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['change']
    event: []
  }
})
