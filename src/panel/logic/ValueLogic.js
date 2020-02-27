export default class ValueLogic {
  constructor () {
    this.type = 'value'
    this.title = '逻辑'
    this.map = {
      '=': {
        key: '=',
        value: '等于',
        validator: (left, right) => left === right
      },
      '>': {
        key: '>',
        value: '大于',
        validator: (left, right) => left > right
      },
      '<': {
        key: '<',
        value: '小于',
        validator: (left, right) => left < right
      },
      '!=': {
        key: '!=',
        value: '不等于',
        validator: (left, right) => left !== right
      },
      '<>': {
        key: '<>',
        value: '包含',
        validator: (left, right) => left.indexOf(right) > -1
      },
      '><': {
        key: '><',
        value: '不包含',
        validator: (left, right) => left.indexOf(right) === -1
      }
    }
  }

  get () {
    return {
      type: 'value',
      key: '',
      action: '',
      value: '',
      effects: [{
        key: '',
        properties: [
          { key: 'hidden', value: false },
          { key: 'disabled', value: false }
        ]
      }]
    }
  }
}
