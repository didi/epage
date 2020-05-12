
import { isArray, isFunction } from '../helper'
/**
 * 规则引擎，处理schema规则并返回validator规则
 */

export default class Rule {
  constructor (schema) {
    this.schema = schema
    this.rules = this.recursiveResolve(this.schema)
  }

  recursiveResolve (schema) {
    let rules = {}
    const recursive = (schema, rules) => {
      const { key, container, children, dynamic, list } = schema

      if (dynamic && isArray(list)) {
        list.forEach(sc => recursive(sc, rules))
      }

      if (container && isArray(children)) {
        children.forEach(child => {
          if (isArray(child.list)) {
            child.list.forEach(item => recursive(item, rules))
          }
        })
      } else {
        if (key in rules) {
          console.warn(`${key} is already in rules`)
        } else {
          if (key) {
            rules[key] = this.resolve(schema)
          }
        }
      }

      return rules
    }
    rules = recursive(schema, rules)
    return rules
  }

  resolve (schema) {
    const rules = schema.rules || []
    const rulesWithValidator = []
    const len = rules.length

    for (let i = 0; i < len; i++) {
      // 默认是否必填作为第一个规则，直接copy到规则列表内
      if (i === 0) {
        rulesWithValidator.push(rules[0])
      } else {
        const TmpRule = Rule.rules[rules[i].type]

        if (isFunction(TmpRule)) {
          rulesWithValidator.push(new TmpRule(rules[i]).rule)
        }
      }
    }
    return rulesWithValidator
  }

  static set (rules) {
    if (rules) {
      const map = {}
      Object.keys(rules).forEach(k => {
        const type = rules[k].type
        if (type in map) {
          return console.log(`rule warning: ${type} is already exist!`)
        }
        map[type] = rules[k]
      })

      const conbineMap = (map1, map2) => {
        if (map1) {
          map2 && Object.assign(map1, map2)
        } else {
          map2 && (map1 = map2)
        }
        return map1
      }

      if (Rule.rules) {
        conbineMap(Rule.rules, map)
        // conbineList(Rule.rule.list, list)
      } else {
        Rule.rules = map
      }
    }
  }
}
Rule.rules = {}
