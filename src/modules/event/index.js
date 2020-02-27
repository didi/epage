import { include } from '../helper'
/**
 * 表单设计器事件处理
 */
export default class EpEvent {
  constructor () {
    this.$events = {}
  }

  /**
   * add event listener for widget
   * @param {String} key [required] schema.key
   * @param {String} type [required] event type
   * @param {Function} callback [required] event callback
   * @return {event} this
   */
  on (key, type, callback) {
    if (!(key in this.$events)) {
      this.$events[key] = { [type]: [callback] }
    }
    if (!(type in this.$events[key])) {
      this.$events[key][type] = [callback]
    }
    const callbacks = this.$events[key][type]
    if (!include(callbacks, callback)) {
      this.$events[key][type].push(callback)
    }

    return this
  }

  /**
   * remove event listener for widget
   * @param {String} key [required] schema.key
   * @param {String} type event type
   * @param {Function} callback event callback
   * @return {event} this
   */
  off (key, type, callback) {
    if (key in this.$events) {
      if (type in this.$events[key]) {
        const callbacks = this.$events[key][type]
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        } else {
          this.$events[key][type] = []
        }
      } else if (typeof type === 'undefined') {
        delete this.$events[key]
      }
    }
    return this
  }
}
