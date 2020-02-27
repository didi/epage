export default class StringRule {
  static get type () {
    return 'string'
  }

  static get name () {
    return '字符串'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'string',
      message: '字符串不符合规则'
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'string',
      trigger: 'blur',
      message: ''
    }
    this.update(this.origin)
  }

  update (rule) {
    if (rule) {
      const { min, max } = rule
      this.rule.message = rule.message
      const intMin = parseInt(min)
      const intMax = parseInt(max)
      if (isNaN(intMin)) {
        delete this.rule.min
      } else {
        this.rule.min = intMin
      }
      if (isNaN(intMax)) {
        delete this.rule.max
      } else {
        this.rule.max = intMax
      }
    }
  }
}
