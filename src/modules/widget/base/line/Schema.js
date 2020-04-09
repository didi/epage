
import { BaseSchema } from '../../../schema'

export default class LineSchema extends BaseSchema {
  constructor (props) {
    super()
    this.option = {
      direction: 'horizontal', // vertical
      // hposition => top, middle, bottom
      hposition: 'middle',
      // vposition: left, center, right
      vposition: 'center',
      length: 100,
      thickness: 1,
      type: 'dashed', // solid | dashed | dotted
      color: '#aaa'
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(LineSchema, {
  title: '线条',
  widget: 'line',
  icon: 'ios-pause',
  logic: {
    value: null,
    event: null
  }
})
