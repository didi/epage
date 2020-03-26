import {
  isNotEmptyString,
  isPlainObject,
  isArray,
  // isNumber,
  // isFunction,
  randomStr,
  include,
  jsonClone
  // setKeyAndName,
  // updateRequiredRule
} from '../helper'

const IGNORE_PROP_LIST = ['list']

export default class Schema {
  constructor (props) {
    const { schema } = props || {}
    this.key = randomStr()
    this.widget = ''
    this.hidden = false
    this.option = {}
    if (!this.widget) {
      this.widget = new.target
        ? new.target.widget
        : (schema ? schema.widget : '')
    }
  }

  create (props) {
    const { schema, clone } = props || {}
    if (isPlainObject(schema) && isNotEmptyString(schema.widget)) {
      // 避免影响到原schema对象，这里需要深度clone一份
      // schema = jsonClone(schema)
      // 当为容器widget时
      // const children = isArray(schema.children) ? [...schema.children] : []

      // children.forEach(child => {
      //   if (!isNumber(child.span) || child.span < 0) {
      //     child.span = 12
      //   }
      //   const list = []
      //   if (isArray(child.list)) {
      //     child.list.forEach(sub => {
      //       const widget = widgets[sub.widget]
      //       if (widget && isFunction(widget.Schema)) {
      //         list.push(new widget.Schema({ schema: sub, widgets, clone, dynamic }))
      //       }
      //     })
      //   }
      //   child.list = list
      // })
      // schema.children = children
      // 不用copy属性 list（为用户动态添加）
      // 拷贝所有属性，没有的遵循默认声明
      for (const i in schema) {
        if (include(IGNORE_PROP_LIST, i) || !(i in this)) {
          continue
        }
        let item = schema[i]
        if (isArray(item)) {
          // item = Object.assign([], this[i], item)
          item = jsonClone(item)
        } else if (isPlainObject(item)) {
          if (isPlainObject(this[i])) {
            item = jsonClone({ ...this[i], ...item })
          } else {
            item = jsonClone(item)
          }
        }
        this[i] = item
      }
      // if (widgets[this.widget]) {
      //   updateRequiredRule(this, widgets[this.widget].Schema)
      // }
      // 复制整个schema时
      if (clone) {
        const key = randomStr()
        this.key = key
        // if (!dynamic) {
        //   this.name = key
        // }
      }
    }
    // setKeyAndName(this)
    return this
  }
}
