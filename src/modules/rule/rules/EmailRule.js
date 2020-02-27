
export default class EmailRule {
  static get type () {
    return 'email'
  }

  static get name () {
    return '邮箱'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'email',
      message: '邮箱格式不正确'
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'email',
      trigger: 'blur',
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
