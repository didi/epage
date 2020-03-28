import { FormSchema } from '../../../schema'

export default class DatePickerSchema extends FormSchema {
  constructor (props) {
    super()
    this.title = '日期选择'
    this.placeholder = '请选择'
    this.rules = [{ required: false, message: '必填', trigger: 'change' }]
    this.option.range = false
    this.option.format = 'yyyy-MM-dd'
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(DatePickerSchema, {
  title: '日期选择',
  widget: 'datePicker',
  icon: 'ios-calendar-outline',
  type: ['string', 'array<string>'],
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
