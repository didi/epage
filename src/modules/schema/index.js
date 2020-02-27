import {
  isNotEmptyString,
  isPlainObject,
  isArray,
  isNumber,
  isFunction,
  randomStr,
  include,
  jsonClone,
  setKeyAndName,
  updateRequiredRule
} from '../helper'
import fields from './fields'

/**
 * widget schema 基础类
 */
export default class Schema {
  constructor (props) {
    Object.keys(fields).forEach(field => {
      const value = fields[field].default
      this[field] = isFunction(value) ? value() : value
    })
    const { schema } = props || {}
    if (!this.widget) {
      this.widget = new.target ? new.target.widget : (schema ? schema.widget : '')
    }
    // 实现基础类Schema也可以根据schema实例化
    if (schema) {
      this.$init(props)
    } else {
      updateRequiredRule(this, new.target)
    }
    if (isNotEmptyString(new.target.type)) {
      this.type = new.target.type
    }
  }

  /**
   * 根据schema json 对象创建Schema实例
   * @param {Object} 初始化参数：
   * schema 待实例化的JSON
   * widgets 已注册的widget集合
   * clone 是否为widget 的 clone操作，需要重新生成key
   * dynamic 是否为用户动态生成的widget
   */
  $init (props) {
    let { schema, widgets = {}, clone, dynamic } = props || {}
    if (isPlainObject(schema) && isNotEmptyString(schema.widget)) {
      // 避免影响到原schema对象，这里需要深度clone一份
      schema = jsonClone(schema)
      // 当为容器widget时
      const children = isArray(schema.children) ? [...schema.children] : []

      children.forEach(child => {
        if (!isNumber(child.span) || child.span < 0) {
          child.span = 12
        }
        const list = []
        if (isArray(child.list)) {
          child.list.forEach(sub => {
            const widget = widgets[sub.widget]
            if (widget && isFunction(widget.Schema)) {
              list.push(new widget.Schema({ schema: sub, widgets, clone, dynamic }))
            }
          })
        }
        child.list = list
      })
      schema.children = children
      // 不用copy属性 list（为用户动态添加）
      // 拷贝所有属性，没有的遵循默认声明
      const uncloneFileds = ['list']
      for (const i in schema) {
        if (include(uncloneFileds, i)) {
          continue
        }
        let item = schema[i]
        if (isArray(item)) {
          item = Object.assign([], this[i], item)
        } else if (isPlainObject(item)) {
          item = Object.assign({}, this[i], item)
        }
        this[i] = item
      }
      if (widgets[this.widget]) {
        updateRequiredRule(this, widgets[this.widget].Schema)
      }
      // 复制整个schema时
      if (clone) {
        const key = randomStr()
        this.key = key
        if (!dynamic) {
          this.name = key
        }
      }
    }
    setKeyAndName(this)
  }

  updateRequiredRule (rule, Schema) {
    updateRequiredRule(this, Schema, rule)
  }
}
