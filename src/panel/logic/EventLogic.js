import Effect from './Effect'

export default class EventLogic {
  constructor () {
    this.type = 'event'
    this.title = '事件逻辑'
    this.map = {
      click: { key: 'click', value: '点击' },
      focus: { key: 'focus', value: '聚焦' },
      blur: { key: 'blur', value: '失焦' },
      change: { key: 'change', value: '改变' }
    }
  }

  get () {
    return {
      type: 'event',
      // schema.key
      key: '',
      // event type: click | change or others
      action: '',

      effects: [new Effect()]
    }
  }
}
