import FormSchema from '../../FormSchema'

export default class SliderSchema extends FormSchema {
  constructor (props) {
    super()
    this.label = '滑块'
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(SliderSchema, {
  title: '滑块',
  widget: 'slider',
  icon: 'minus-round',
  type: 'number',
  validators: 'number',
  logic: {
    value: ['=', '!='],
    // event: ['change']
    event: []
  }
})
