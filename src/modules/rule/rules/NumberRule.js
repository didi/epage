
export default class NumberRule {
  static get type () {
    return 'number'
  }

  static get name () {
    return '数字'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'number',
      trigger: 'blur',
      message: '数字不正确'
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'number',
      trigger: 'blur',
      message: ''
    }
    this.update(this.origin)
  }

  update (rule) {
    if (rule) {
      this.rule.message = rule.message
      const { min, max } = rule
      const floatMin = parseFloat(min)
      const floatMax = parseFloat(max)
      if (isNaN(floatMin)) {
        delete this.rule.min
      } else {
        this.rule.min = floatMin
      }
      if (isNaN(floatMax)) {
        delete this.rule.max
      } else {
        this.rule.max = floatMax
      }
      // this.rule.min = isNaN(floatMin) ? undefined : floatMin
      // this.rule.max = isNaN(floatMax) ? undefined : floatMax
    }
  }
}
