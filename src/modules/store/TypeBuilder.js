import { isPlainObject, isFunction } from '../helper'

export default class TypeBuilder {
  /**
   * 构建不同类型数据的默认值，builder必须返回全新数据
   * @param {Object} types 新builder类型，与内置类型重复将被忽略
   * 内置：string | boolean | number | array | object | null
   */
  constructor (types) {
    this.types = {
      string: () => '',
      boolean: () => false,
      number: () => 0,
      array: () => [],
      object: () => ({}),
      null: () => null,
      date: () => new Date(),
      // composition type
      'array<date>': () => [],
      'array<string>': () => [],
      'array<number>': () => [],
      'array<boolean>': () => []
    }
    this.add(types)
    this.convert = {}
  }

  /**
   * 添加自定义数据类型的builder
   * @param {Object} types builder 对应类型
   * 如：{ string: () => ''}
   */
  add (types) {
    if (!isPlainObject(types)) {
      return
    }
    for (const i in types) {
      const builder = types[i]
      if (!(i in this.types) && isFunction(builder)) {
        this.types[i] = builder
      }
    }
  }
}

TypeBuilder.convert = {
  string2number: s => {
    const r = parseFloat(s)
    return isNaN(r) ? null : r
  },
  string2boolean: s => !!s,
  number2string: n => {
    const r = String(n)
    return r === '[object Object]' ? null : r
  },
  number2boolean: n => !!n,
  boolean2string: b => String(b),
  boolean2number: b => Number(b)
}

/**
 * resolve schema type
 * @param {String} type Schema.type
 * @param {Boolean} structure data structure,
 * @example
 * resolve('array<string>', true) // array
 * resolve('string', true) // string
 */
TypeBuilder.resolve = function (type, structure) {
  const matched = type.match(/<(\w+)>/)
  if (structure) {
    return type.split('<')[0]
  }
  return matched ? matched[1].toLowerCase() : type.toLowerCase()
}
