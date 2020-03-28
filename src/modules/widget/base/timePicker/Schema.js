import { FormSchema } from '../../../schema'

export default class TimePickerSchema extends FormSchema {
  constructor (props) {
    super()
    this.title = '时间'
    this.placeholder = '请选择'
    this.rules = [{ required: false, message: '必填', trigger: 'change' }]
    this.option = {
      range: false,
      format: 'HH:mm:ss'
    }
    this.create(props)
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
