
import Schema from '../../../../modules/schema'

export default class ButtonSchema extends Schema {
  constructor (props) {
    super()
    this.option = {
      text: '提交',
      // 按钮类型：primary、dashed、text、default
      type: 'primary',
      // 按钮图标
      icon: '',
      // 是否通栏
      long: false,
      // 是否幽灵按钮
      ghost: false,
      // 形状，可选 'square': 方角；'circle': 圆角
      shape: 'square'
    }
    this.$init(props)
  }
}

// 静态配置，同类widget公有
Object.assign(ButtonSchema, {
  title: '按钮',
  widget: 'button',
  icon: 'social-youtube-outline',
  type: 'string',
  validators: [],
  logic: {
    value: null,
    event: ['click']
  }
})
