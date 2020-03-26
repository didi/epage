import Schema from '../../../schema/FormSchema'

export default class InputNumberSchema extends Schema {
  constructor (props) {
    super()
    this.type = 'number'
    this.title = '数字'
    this.placeholder = '请输入'
    this.rules = [{ required: false, message: '必填', trigger: 'change', type: 'number' }]
    this.option = {
      min: 0,
      max: 100,
      step: 1,
      precision: 1
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(InputNumberSchema, {
  title: '数字框',
  widget: 'inputNumber',
  icon: 'ios-calculator',
  type: 'number',
  validators: [],
  logic: {
    value: ['=', '>', '<', '!='],
    // event: ['focus', 'blur', 'change']
    event: []
  }
})
