import FormSchema from '../../FormSchema'

export default class ButtonSchema extends BaseSchema {
  constructor (props) {
    super()
    this.option = {
      // 动作类型：submit、goback、reset
      actionType: 'submit',
      text: '提交',
      // 按钮类型：primary、ghost、dashed、text、default
      type: 'primary',
      // 是否通栏
      long: false,
      // 形状，可选 'square': 方角；'circle': 圆角
      shape: 'square',
      url: '',
      method: 'POST'
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(ButtonSchema, {
  title: '表单按钮',
  widget: 'formButton',
  icon: 'social-youtube-outline',
  logic: {
    value: null,
    event: []
  }
})
