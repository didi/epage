import Schema from '../../../../modules/schema'

export default class RateSchema extends Schema {
  constructor (props) {
    super()
    this.type = 'number'
    this.title = '评分'
    this.rules = [{ required: false, message: '必填', min: 0, type: 'number' }]
    this.option = {
      count: 5
    }
    this.$init(props)
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
