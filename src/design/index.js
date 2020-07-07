import Vue from 'vue'
import { Store, Rule, helper } from '../modules'
import Editor from './index.vue'

const { isArray, isFunction } = helper

export default class Design {
  constructor (option) {
    const {
      el,
      widgets = [],
      schema,
      Render,
      panels,
      setting,
      env,
      Rule: CustomRule
    } = option || {}

    this.el = el
    this.store = new Store({ Rule: CustomRule || Rule })
    this.Render = Render
    // 设计及预览面板渲染器示例
    this.$render = null
    // 设计器不同面板显示信息，设计(design)面板不可隐藏
    this.panels = panels || {}
    // 控制widget 属性显隐等信息
    this.setting = setting || {}
    this.env = env || 'production'
    this.$$origin = null
    if (isArray(widgets)) {
      this.store.initWidgets(widgets)
      if (typeof schema === 'object') {
        this.store.initRootSchema(schema)
      }

      this.$$origin = this.render()
    } else {
      console.error('widgets must be an array')
    }
  }

  setRender (instance) {
    this.$render = instance
  }

  render () {
    const { el, store, Render, panels, setting, env } = this
    const extension = { store, Render, env, panels, setting, setRender: this.setRender.bind(this) }
    /* eslint-disable no-new */
    return new Vue({ extension, el, render: h => h(Editor) })
  }

  destroy () {
    if (this.$$origin && isFunction(this.$$origin.$destroy)) {
      this.$$origin.$destroy()
      this.$$origin.$off()
      this.store.$$store = null
    }
  }
}
