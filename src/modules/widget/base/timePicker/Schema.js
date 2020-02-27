import Schema from '../../../../modules/schema'

export default class TimePickerSchema extends Schema {
  constructor (props) {
    super()
    this.title = '时间'
    this.placeholder = '请选择'
    this.rules = [{ required: false, message: '必填', trigger: 'change' }]
    this.option.type = 'time'
    this.option.format = 'HH:mm:ss'
    this.$init(props)
  }
}

// 静态配置，同类widget公有
Object.assign(TimePickerSchema, {
  title: '时间选择',
  widget: 'timePicker',
  icon: 'ios-clock-outline',
  type: ['string', 'array<string>'],
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
