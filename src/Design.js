import Vue from 'vue'
import iview from 'iview'
import { Store, Rule, helper, hook } from 'epage-core'
import Editor from './index.vue'
const Vuex = require('vuex')

const {
  isArray,
  isFunction,
  usePlugins,
  isPlainObject
} = helper

const defaultView = t => Object.assign({
  component: null,
  widgets: [],
  Render: null
}, t || {})
export default class Design {
  constructor (opt = {}) {
    // 设计器挂载节点
    this.el = opt.el
    // 自定义面板配置
    this.panels = opt.panels || {}
    // 扩展的全局配置面板 array<object{key, name, component, framework}>
    this.settings = opt.settings || []
    // 插件集合，通过$initPlugins初始
    this.plugins = opt.plugins || []
    // PC端设计时，默认配置
    this.pc = defaultView(opt.pc)
    // 移动端设计时，默认配置
    this.mobile = defaultView(opt.mobile)
    // 当前环境，暂无特别用途
    this.env = opt.env || 'production'
    // 默认设计视图
    this.view = opt.view || 'pc'
    // 以下3个属性将移动到 pc | mobile属性中，目前为了兼容老版本
    this.Render = opt.Render
    // 待注册的widgets
    this.widgets = opt.widgets
    // 渲染器入口文件，react对应.jsx文件，vue对应.vue文件
    this.component = opt.component

    // default schema
    this.schema = opt.schema
    // 设计器render结果
    this.$$origin = null
    // 设计及预览面板渲染器实例
    this.$render = null

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
    const widgets = this.widgets || (
      this[this.view]
        ? (this[this.view].widgets || [])
        : []
    )

    if (isArray(widgets)) {
      this.store.initWidgets(widgets)

      if (isPlainObject(this.schema)) {
        this.store.initRootSchema(this.schema)
      }

      this.$$origin = this.render()
    } else {
      console.error('widgets must be an array')
    }
  }

  // 当前设计器内渲染器实例
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
      env,
      view,
      pc,
      mobile,
      Render,
      widgets,
      component
    } = this
    const extension = {
      store,
      panels,
      settings,
      env,
      view,
      pc,
      mobile,
      Render,
      widgets,
      component,
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
      this.callPlugin('life', 'beforeDestroy', { ctx: this })
      this.$$origin.$destroy()
      this.$$origin.$off()
      this.store.$$store = null
      this.callPlugin('life', 'destroyed', { ctx: this })
      this.$hooks = {}
    }
  }
}
