<template lang="pug">
.ep-editor.ep-layout
  ep-header.ep-layout-header(
    v-if='panels.header !== false'
    :header='panels.header'
    :store='store'
    :design-view='design'
    :ready='ready'
    @change-view='renderDesignView'
    @preview='onPreview'
    @show-schema='showSchemaPanel'
    @show-logic='showLogicPanel'
  )
  .ep-layout-body
    template(v-if='panels.tool')
      .ep-layout-left(
        v-if='panels.tool.render'
        ref='tool'
        :style='(panels.tool || {}).style || ""'
      )
      .ep-layout-left(v-else :style='(panels.tool || {}).style || ""')
        .ep-layout-left-nav(v-if='false')
          .ep-layout-left-nav-item(
            v-for='item in nav.list'
            :key='item.key'
            :class='{"ep-layout-left-nav-active": nav.active === item.key}'
            @click='nav.active = item.key'
          )
            span.ep-layout-left-nav-text {{item.value}}

        .ep-layout-left-content
          .ep-tool(v-show='nav.active === "widget"')
            ep-tool(:widgets='widgets' @on-add='onAddWidget')
          ep-store(v-show='nav.active === "store"' :store='store')

    //- store配置
    .ep-side-right(v-show='nav.active === "store"')
      ep-store-setting(v-show='nav.active === "store"' :store='store')

    //- 工作区
    .ep-layout-center.ep-work(
      v-show='nav.active === "widget"'
    )
      ep-panel.ep-work-design
        div(v-show='design.view === "pc"')
          div(class='design-pc' ref='design-pc')
        div(v-show='design.view === "h5"')
          ep-h5-emulator
            div(class='design-h5' ref='design-h5')

    template(v-if='panels.setting')
      .ep-layout-right(
        v-show='nav.active === "widget"'
      )
        .ep-setting(
          v-if='panels.setting.render'
          ref='setting'
          :style='(panels.setting || {}).style || ""'
        )
        .ep-setting(v-else :style='(panels.setting || {}).style || ""')
          ep-setting(
            :store='store'
            :settings='settings'
          )
          //- .ep-control-handle(@click='onUnfold') {{settingState.text}}
  template(v-if='panels.footer')
    .ep-layout-footer(
      v-if='panels.footer.render'
      ref='footer'
      :style='(panels.footer || {}).style || ""'
    )
  ep-fullscreen(:visible='!!preview.view' @on-close='closePreview')
    div(slot='header' style='font-size: 12px;font-weight: normal;text-align: center;')
      RadioGroup.ep-preview-header-view(
        v-if='ready.pc && ready.h5'
        v-model='preview.view'
        type='button'
        size='small'
        @on-change='changePreview'
      )
        Radio(label='pc') PC
        Radio(label='h5') H5
    template(v-show='preview.view === "pc"')
      .ep-preview-pc(ref='preview-pc')

    div(v-show='preview.view === "h5"')
      ep-h5-emulator
        div(ref='preview-h5')

  ep-fullscreen(:visible='!!schemaPanel.visible' @on-close='closeSchemaPanel')
    div(slot='header')
      span Schema
    ep-schema(
      v-if='schemaPanel.visible'
      v-model='rootSchema'
      :store='store'
    )
  ep-fullscreen(:visible='!!logicPanel.visible' @on-close='closeLogicPanel')
    div(slot='header')
      span Logic
    ep-logic(v-if='logicPanel.visible' :store='store')

</template>

<script>
import { helper } from 'epage-core'
import {
  EpPanel,
  EpH5Emulator,
  EpFullscreen
} from './components'
import {
  EpStore,
  EpStoreSetting,
  EpTool,
  EpSchema,
  EpLogic,
  EpSetting,
  EpHeader
} from './panel'

const defaultHeader = () => ({
  left: {},
  center: {},
  right: {}
})
const defaultPanels = () => ({
  preview: true,
  logic: true,
  schema: true,
  header: defaultHeader(),
  tool: true,
  setting: true,
  footer: false
})

export default {
  components: {
    EpPanel,
    EpStore,
    EpStoreSetting,
    EpTool,
    EpLogic,
    EpSchema,
    EpSetting,
    EpHeader,
    EpH5Emulator,
    EpFullscreen
  },

  data () {
    return {
      // 预览视图渲染缓存
      preview: {
        view: '', // pc | h5
        pc: null,
        h5: null
      },
      // 设计视图渲染缓存
      design: {
        view: 'pc', // pc | h5
        pc: null,
        h5: null
      },
      // pc 及 h5 组件、Render等是否ready
      ready: {
        pc: false,
        h5: false
      },
      schemaPanel: {
        visible: false
      },
      logicPanel: {
        visible: false
      },
      env: process.env.NODE_ENV,
      // 展示模式，不同于设计还是预览
      panels: defaultPanels(),
      // 自定义设置面板
      settings: [],
      nav: {
        list: [{
          key: 'widget',
          value: '物料'
        }, {
          key: 'store',
          value: '仓库'
        }],
        active: 'widget' // widget | store
      },
      settingState: {
        fold: false,
        text: '收起'
      }
    }
  },

  computed: {
    store () {
      return this.$root.$options.extension.store
    },
    widgets () {
      return this.store.getWidgets()
    },
    flatWidgets () {
      return this.store.getFlatWidgets()
    },
    rootSchema () {
      return this.store.getRootSchema()
    },
    selectedSchema () {
      return this.store.getSelectedSchema()
    },
    panelExtClass () {
      return {
        'ep-panel-top0': this.panels.header === false
      }
    }
  },

  beforeMount () {
    const ext = this.$root.$options.extension || {}
    Object.assign(this.panels, ext.panels)
    this.settings = ext.settings
    this.design.view = ext.view || 'pc'
    this.setReady()
  },

  mounted () {
    this.renderDesignView(this.design.view)
    this.renderRef(this.panels, 'setting')
    this.renderRef(this.panels, 'tool')
    this.renderRef(this.panels, 'footer')
    // 切换到设计模式
    this.store.updateTab('design')
  },

  methods: {
    // getPanelClass() {
    //   const cls = []
    //   if (this.panels.header === false ) {
    //     cls.push('ep-panel-top0')
    //   }
    //   return cls
    // },
    // getWorkPanelClass () {
    //   const cls = this.getPanelClass()
    //   // if (this.settingState.fold) {
    //   //   cls.push('ep-work-expand')
    //   // }
    //   return cls
    // },
    // getSettingPanelClass () {
    //   const cls = this.getPanelClass()
    //   if (this.settingState.fold) {
    //     cls.push('ep-setting-fold')
    //   }
    //   return cls
    // },
    setReady () {
      const ext = this.$root.$options.extension || {}
      const { pc, h5 } = ext
      const hasPC = pc && pc.widgets && pc.Render
      const hasH5 = h5 && h5.widgets && h5.Render

      this.ready.pc = !!hasPC
      this.ready.h5 = !!hasH5
    },
    getIns (view) {
      const ext = this.$root.$options.extension || {}
      return ext[view]
    },
    onPreview () {
      this.renderPreview(this.design.view)
    },
    showSchemaPanel () {
      this.schemaPanel.visible = true
    },
    closeSchemaPanel () {
      this.schemaPanel.visible = false
    },
    showLogicPanel () {
      this.logicPanel.visible = true
    },
    closeLogicPanel () {
      this.logicPanel.visible = false
    },
    changePreview (view) {
      this.renderPreview(view)
    },
    closePreview () {
      this.preview.view = ''
      const { h5, pc } = this.preview
      this.destoryRender(h5)
      this.destoryRender(pc)
    },
    // 销毁指定渲染器实例
    destoryRender (render) {
      if (!render) return
      if (!helper.isFunction(render.destroy)) return
      render.destroy()
    },
    /**
     * 设计器内渲染器及预览时的创建渲染器
     * view: pc | h5
     * mode: design | preview
     */
    renderView (view, mode) {
      if (!view || !mode) return
      const VIEWS = ['pc', 'h5']
      const el = this.$refs[mode + '-' + view]
      const schema = this.store.getSchema()
      const { pc, h5 } = this[mode]
      const ext = this.$root.$options.extension
      const { setRender, callPlugin, Render, widgets, component } = ext

      this[mode].view = view
      if (!helper.include(VIEWS, view)) return
      const ins = this.getIns(view)

      if (!ins) return

      // 这里为了兼容直接传参而非pc|h5对象
      const _Render = Render || ext[view].Render
      const _widgets = widgets || ext[view].widgets
      const _component = component || ext[view].component

      if (!_Render || !_widgets || !_widgets.length || !_component) return

      const args = { el, mode: 'edit' }

      // 设计模式
      if (mode === 'design') {
        this.store.initWidgets(_widgets)
        args.store = this.store

      // 预览模式
      } else {
        args.schema = schema
        args.widgets = _widgets
      }
      args.component = _component
      args.callPlugin = callPlugin

      this[mode][view] = new _Render(args)

      // 设计模式下，把当前设计视图的渲染器实例告诉设计器实例
      if (mode === 'design') {
        setRender(this.design[view])
      }
      if (view === 'pc') this.destoryRender(h5)
      if (view === 'h5') this.destoryRender(pc)
    },
    // 预览时创建一个渲染器
    renderPreview (view) {
      this.renderView(view, 'preview')
    },
    // 创建设计器内一个渲染器
    renderDesignView (view) {
      this.renderView(view, 'design')
    },
    onUnfold () {
      const { fold } = this.settingState
      if (fold) {
        this.settingState = { fold: false, text: '收起' }
      } else {
        this.settingState = { fold: true, text: '展开' }
      }
    },
    onAddWidget (widget) {
      this.store.addWidget(widget)
    },
    renderRef (obj, ref) {
      if (!obj[ref] || typeof obj[ref].render !== 'function') return
      const el = this.$refs[ref]
      const ctx = { $emit: this.$emit.bind(this) }
      const { store } = this

      obj[ref].render({ el, store, ctx })
    }
  }
}
</script>
