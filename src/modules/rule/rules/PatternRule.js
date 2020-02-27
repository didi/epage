
export default class PatternRule {
  static get type () {
    return 'pattern'
  }

  static get name () {
    return '正则表达式'
  }

  constructor (rule = {}) {
    const defaultRule = {
      type: 'pattern',
      pattern: '',
      message: '',
      ignoreCase: false,
      global: false,
      multiline: false
    }
    this.origin = Object.assign({}, defaultRule, rule)
    this.rule = {
      type: 'pattern',
      trigger: 'blur',
      pattern: new RegExp(),
      message: ''
    }
    this.update(this.origin)
  }

  update (rule) {
    if (rule) {
      const { pattern, ignoreCase, global, multiline } = rule
      this.rule.message = rule.message
      const flags = [ignoreCase ? 'i' : '', global ? 'g' : '', multiline ? 'm' : ''].join('')
      let reg = new RegExp()
      if (typeof pattern === 'string' && pattern.length) {
        try {
          reg = new RegExp(rule.pattern, flags)
        } catch (e) {
          // console.log(e)
        }
      }
      this.rule.pattern = reg
    }
  }
}
