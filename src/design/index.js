import Vue from 'vue'
import { Store, Rule } from '../modules'
import Editor from './index.vue'

export default class Design {
  constructor (option) {
    const {
      el,
      widgets = [],
      schema,
      getSchema,
      getFormData,
      Render,
      panels,
      setting,
      env,
      Rule: CustomRule
    } = option || {}

    this.el = el
    this.store = new Store({ Rule: CustomRule || Rule })
    this.getSchema = getSchema
    this.getFormData = getFormData
    this.Render = Render
    // 设计器不同面板显示信息，设计(design)面板不可隐藏
    this.panels = panels || {}
    // 控制widget 属性显隐等信息
    this.setting = setting || {}
    this.env = env || 'production'
    this.$$origin = null
    if (Array.isArray(widgets)) {
      this.store.initWidgets(widgets)
      if (typeof schema === 'object') {
        this.store.initRootSchema(schema)
      }

      this.$$origin = this.render()
    } else {
      console.error('widgets must be an array')
    }
  }

  render () {
    const { el, store, Render, panels, setting, env, getSchema, getFormData } = this
    const extension = { store, Render, getSchema, getFormData, env, panels, setting }
    /* eslint-disable no-new */
    return new Vue({ extension, el, render: h => h(Editor) })
  }

  destroy () {
    if (this.$$origin && typeof this.$$origin.$destroy === 'function') {
      this.$$origin.$destroy()
      this.$$origin.$off()
      this.store.$$store = null
    }
  }
}
