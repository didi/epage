
export default class URLRule {
  static get type () {
    return 'url'
  }

  static get name () {
    return '网址'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'url',
      message: '非法URL'
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'url',
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
