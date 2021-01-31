import Vue from 'vue'
import iview from 'iview'
import { Store, Rule, helper, hook } from 'epage-core'
import Editor from './index.vue'
const Vuex = require('vuex')

const {
  isArray,
  isFunction,
  usePlugins
} = helper

const terminal = t => Object.assign({
  main: null,
  widgets: [],
  Render: null
}, t || {})
export default class Design {
  constructor (opt = {}) {
    this.el = opt.el
    this.panels = opt.panels || {}
    this.settings = opt.settings || []
    this.setting = opt.setting || {}
    this.plugins = opt.plugins || []
    this.pc = terminal(opt.pc)
    this.mobile = terminal(opt.mobile)
    this.env = opt.env || 'production'
    this.view = opt.view || 'pc'
    // 以下3个属性将移动到 pc | mobile属性中，目前为了兼容老版本
    this.Render = opt.Render || (opt[this.view] || {}).Render
    this.widgets = opt.widgets || (opt[this.view] || {}).widgets
    this.main = opt.main || (opt[this.view] || {}).main

    // default schema
    this.schema = opt.schema
    // 设计器render结果
    this.$$origin = null
    // 设计及预览面板渲染器实例
    this.$render = null

    // this.panels = panels || {}

    // this.setting = setting || {}

    // this.settings = settings || []
    // 设计器自定义配置，未来会统一settings、panels、setting、env等信息
    // const _config = config || {}
    // // 设计器不同面板显示信息，设计(design)面板不可隐藏
    // _config.panels = _config.panels || panels
    // // 自定义设置面板
    // _config.settings = _config.settings || settings
    // // 控制widget 属性显隐等信息
    // _config.setting = _config.setting || setting
    // _config.env = _config.env || env || 'production'

    // this.config = _config
    // 定义钩子函数
    this.$hooks = {
      // 设计器生命周期
      life: {
        init: new hook.SyncHook(),
        beforeCreate: new hook.SyncHook(),
        created: new hook.SyncHook(),
        beforeDestroy: new hook.SyncHook(),
        destroyed: new hook.SyncHook()
      },
      // schema 相关hook
      schema: {
        copy: new hook.SyncWaterfallHook()
      },
      // 渲染器hook
      render: {
        init: new hook.SyncHook(),
        beforeCreate: new hook.SyncHook(),
        created: new hook.SyncHook(),
        beforeDestroy: new hook.SyncHook(),
        destroyed: new hook.SyncHook()
      }
    }
    usePlugins(Vue, [Vuex, iview])
    // 注册插件
    this.$initPlugins()
    // 调用设计器初始化生命周期
    this.callPlugin('life', 'init')
    this.store = new Store({ Rule: opt.Rule || Rule })

    if (isArray(this.widgets)) {
      this.store.initWidgets(this.widgets)
      if (typeof this.schema === 'object') {
        this.store.initRootSchema(this.schema)
      }

      this.$$origin = this.render()
    } else {
      console.error('widgets must be an array')
    }
  }

  setRender (instance) {
    this.$render = instance
  }

  $initPlugins () {
    const { plugins = [] } = this

    plugins.forEach(plugin => {
      isFunction(plugin.apply) && plugin.apply(this.$hooks, this)
    })
  }

  callPlugin (type, hook, ...args) {
    if (!this.$hooks[type]) return
    const tasks = this.$hooks[type][hook]
    if (!tasks) return
    return tasks.call(...args)
  }

  render () {
    const {
      el,
      store,
      panels,
      settings,
      setting,
      env,
      view,
      pc,
      mobile,
      Render,
      widgets,
      main
    } = this
    const extension = {
      store,
      panels,
      settings,
      setting,
      env,
      view,
      pc,
      mobile,
      Render,
      widgets,
      main,
      setRender: this.setRender.bind(this),
      callPlugin: this.callPlugin.bind(this)
    }
    this.callPlugin('life', 'beforeCreate', { ctx: this })
    /* eslint-disable no-new */
    const ins = new Vue({ extension, el, render: h => h(Editor) })
    this.callPlugin('life', 'created', { ctx: this, ins })
    return ins
  }

  destroy () {
    this.$render = null
    if (this.$$origin && isFunction(this.$$origin.$destroy)) {
      this.callPlugin('life', 'beforeDestroy', this)
      this.$$origin.$destroy()
      this.$$origin.$off()
      this.store.$$store = null
      this.callPlugin('life', 'destroyed', this)
      this.$hooks = {}
    }
  }
}
