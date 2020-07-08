import FormSchema from '../../FormSchema'

export default class SwitchSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '开关'
    this.rules = [{
      type: 'boolean',
      message: '必填',
      trigger: 'change',
      required: false
    }]
    this.option = {
      open: '是',
      close: '否'
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(SwitchSchema, {
  title: '开关',
  widget: 'switch',
  icon: 'toggle',
  type: 'boolean',
  validators: [],
  logic: {
    value: ['=', '!='],
    // event: ['change']
    event: []
  }
})
