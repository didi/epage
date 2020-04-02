import { BaseSchema } from '../../../schema'
import {
  isArray,
  isPlainObject,
  isNotEmptyString,
  jsonClone,
  isNumber,
  isFunction
} from '../../../helper'

const getDefaultChildren = () => [
  { span: 12, list: [] },
  { span: 12, list: [] }
]
export default class GridSchema extends BaseSchema {
  constructor (props) {
    super()
    this.label = '布局'
    this.container = true
    // 设置form data数据是否平级展开还是层级嵌套
    // this.group = false
    this.children = getDefaultChildren()
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
    this.createChildren(props)
  }

  createChildren (props) {
    let { schema, widgets = {}, clone, dynamic } = props || {}
    if (isPlainObject(schema) && isNotEmptyString(schema.widget)) {
      // 避免影响到原schema对象，这里需要深度clone一份
      schema = jsonClone(schema)
      const children = isArray(schema.children) ? schema.children : []
      if (!children.length) {
        children.push(getDefaultChildren())
      }
      children.forEach(child => {
        if (!isNumber(child.span) || child.span < 0) {
          child.span = 12
        }
        const list = []
        if (isArray(child.list)) {
          child.list.forEach(sub => {
            const widget = widgets[sub.widget]
            if (widget && isFunction(widget.Schema)) {
              const newSub = new widget.Schema({ schema: sub, widgets, clone, dynamic })
              list.push(newSub)
            }
          })
        }
        child.list = list
      })
      this.children = children
    }
  }
}

// 静态配置，同类widget公有
Object.assign(GridSchema, {
  title: '布局',
  widget: 'grid',
  icon: 'grid',
  // validators: [],
  logic: {
    value: [],
    event: []
  }
})
