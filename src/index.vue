<template lang="pug">
.ep-editor
  ep-header(
    :header='panels.header'
    :store='store'
    :design-view='design'
    :ready='ready'
    @change-view='renderDesignView'
    @preview='onPreview'
    @show-schema='showSchemaPanel'
    @show-logic='showLogicPanel'
  )

  .ep-side-left

    .ep-side-left-nav(v-if='false')
      .ep-side-left-nav-item(
        v-for='item in nav.list'
        :key='item.key'
        :class='{"ep-side-left-nav-active": nav.active === item.key}'
        @click='nav.active = item.key'
      ) {{item.value}}

    .ep-side-left-content
      .ep-tool(v-show='nav.active === "widget"')
        ep-tool(:widgets='widgets' @on-add='onAddWidget')
      ep-store(v-show='nav.active === "store"' :store='store')

  //- store配置
  .ep-side-right(v-show='nav.active === "store"')
    ep-store-setting(v-show='nav.active === "store"' :store='store')

  //- 工作区
  .ep-work(
    v-show='nav.active === "widget"'
    :class='{"ep-work-expand": settingState.fold}'
  )
    ep-panel.ep-work-design
      div(v-show='design.view === "pc"')
        div(class='design-pc' ref='design-pc')
      div(v-show='design.view === "mobile"')
        ep-mobile-emulator
          div(class='design-mobile' ref='design-mobile')

  .ep-setting(
    v-show='nav.active === "widget"'
    :class='{"ep-setting-fold": settingState.fold}'
  )
    ep-setting(
      :store='store'
      :settings='settings'
    )
    .ep-control-handle(@click='onUnfold') {{settingState.text}}

  ep-fullscreen(:visible='!!preview.view' @on-close='closePreview')
    div(slot='header' style='font-size: 12px;font-weight: normal;text-align: center;')
      RadioGroup.ep-preview-header-view(
        v-if='ready.pc && ready.mobile'
        v-model='preview.view'
        type='button'
        size='small'
        @on-change='changePreview'
      )
        Radio(label='pc') PC
        Radio(label='mobile') H5
    template(v-show='preview.view === "pc"')
      .ep-preview-pc(ref='preview-pc')

    div(v-show='preview.view === "mobile"')
      ep-mobile-emulator
        div(ref='preview-mobile')

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
  EpMobileEmulator,
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
  header: defaultHeader()
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
    EpMobileEmulator,
    EpFullscreen
  },

  data () {
    return {
      // 预览视图渲染缓存
      preview: {
        view: '', // pc | mobile
        pc: null,
        mobile: null
      },
      // 设计视图渲染缓存
      design: {
        view: 'pc', // pc | mobile
        pc: null,
        mobile: null
      },
      // pc 及 mobile 组件、Render等是否ready
      ready: {
        pc: false,
        mobile: false
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
    // 切换到设计模式
    this.store.updateTab('design')
  },

  methods: {
    setReady () {
      const ext = this.$root.$options.extension || {}
      const { pc, mobile } = ext
      const hasPC = pc && pc.widgets && pc.Render
      const hasMobile = mobile && mobile.widgets && mobile.Render

      this.ready.pc = !!hasPC
      this.ready.mobile = !!hasMobile
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
      const { mobile, pc } = this.preview
      this.destoryRender(mobile)
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
     * view: pc | mobile
     * mode: design | preview
     */
    renderView (view, mode) {
      if (!view || !mode) return
      const VIEWS = ['pc', 'mobile']
      const el = this.$refs[mode + '-' + view]
      const schema = this.store.getSchema()
      const { pc, mobile } = this[mode]
      const ext = this.$root.$options.extension
      const { setRender, callPlugin, Render, widgets, component } = ext

      this[mode].view = view
      if (!helper.include(VIEWS, view)) return
      const ins = this.getIns(view)

      if (!ins) return

      // 这里为了兼容直接传参而非pc|mobile对象
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
      if (view === 'pc') this.destoryRender(mobile)
      if (view === 'mobile') this.destoryRender(pc)
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
    }
  }
}
</script>
