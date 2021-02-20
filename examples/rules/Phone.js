
export default class PhoneRule {
  static get type () {
    return 'phone'
  }

  static get name () {
    return '手机号'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'pattern',
      pattern: '',
      message: '手机号不正确'
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'pattern',
      trigger: 'blur',
      pattern: /^1[3-9]\d{9}$/g,
      message: ''
    }
    this.update(this.origin)
  }

  update (rule) {
    if (rule) {
      this.rule.message = rule.message
      Object.assign(this.origin, rule)
    }
  }
}
