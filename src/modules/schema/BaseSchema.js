import {
  isPlainObject,
  isArray,
  randomStr,
  include,
  jsonClone
} from '../helper'

// this prop list should be ignore when copy schema
const IGNORE_PROP_LIST = ['list']

/**
 * the basic Schema
 */
export default class BaseSchema {
  constructor (props) {
    const { schema } = props || {}
    // globally unique
    this.key = randomStr()
    // widget type
    this.widget = ''
    // should be hidden
    this.hidden = false
    // extra options for this schema
    this.option = {}
    // create schema instance from schema object
    this.create(props)
    if (!this.widget) {
      this.widget = new.target
        ? new.target.widget
        : (schema ? schema.widget : '')
    }
  }

  create (props) {
    const { schema, clone } = props || {}
    if (isPlainObject(schema)) {
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
      // 复制整个schema时
      if (clone || !this.key) {
        this.key = randomStr()
      }
    }
  }
}
