import Schema from '../../../schema/Schema'

export default class GridSchema extends Schema {
  constructor (props) {
    super()
    this.title = '布局'
    this.container = true
    // 设置form data数据是否平级展开还是层级嵌套
    // this.group = false
    this.children = [
      { span: 12, list: [] },
      { span: 12, list: [] }
    ]
    this.option = {
      gutter: 0,
      align: 'top',
      justify: 'start'
    }
    // this.style = {
    //   background: 'rgba(255, 255, 255, 0)',
    //   border: '0px solid #ccc',
    //   padding: '0 0 0 0',
    //   margin: '0 0 0 0',
    //   'border-radius': '4px'
    // }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(GridSchema, {
  title: '布局',
  widget: 'grid',
  icon: 'grid',
  type: 'object',
  validators: [],
  logic: {
    value: [],
    event: []
  }
})
