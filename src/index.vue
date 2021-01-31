<template lang="pug">
.ep-editor
  ep-header(
    :header='panels.header'
    :store='store'
    :design-view='design'
    :ready='ready'
    @change-view='renderDesignView'
    @preview='onPreview'
    @show-schema='onShowSchemaPanel'
    @show-logic='onShowLogicPanel'
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
    //- Tabs.ep-work-tabs(
      v-model='tab'
      size='small'
      @on-click='renderView')
      TabPane(
        label='设计'
        name='design'
        :icon='icon.design'
      )
        ep-panel.ep-work-design
          div(ref='design')

      TabPane(
        v-if='panels.preview'
        label='预览'
        name='preview'
        :icon='icon.preview'
      )
        ep-panel.ep-work-preview
          div(ref='preview')

      TabPane(
        v-if='panels.logic'
        label='逻辑'
        name='logic'
        :icon='icon.logic'
      )
        ep-panel.ep-work-logic
          ep-logic(v-if='tab === "logic"' :store='store')

      TabPane(
        v-if='panels.schema'
        label='Schema'
        name='schema'
        :icon='icon.schema'
      )
        ep-panel.ep-work-schema
          ep-schema(
            v-if='tab === "schema"'
            v-model='rootSchema'
            :store='store'
          )

  .ep-setting(
    v-show='nav.active === "widget"'
    :class='{"ep-setting-fold": settingState.fold}'
  )
    ep-setting(
      :store='store'
      :setting='setting'
      :settings='settings'
    )
    .ep-control-handle(@click='onUnfold') {{settingState.text}}

  ep-fullscreen(:visible='!!preview.view' @on-close='onPreviewClose')
    div(slot='header' style='font-size: 12px;font-weight: normal;text-align: center;')
      RadioGroup.ep-preview-header-view(
        v-if='ready.pc && ready.mobile'
        v-model='preview.view'
        type='button'
        size='small'
        @on-change='onPreviewChange'
      )
        Radio(label='pc') PC
        Radio(label='mobile') H5
    template(v-show='preview.view === "pc"')
      .ep-preview-pc(ref='preview-pc')

    div(v-show='preview.view === "mobile"')
      ep-mobile-emulator
        div(ref='preview-mobile')

  ep-fullscreen(:visible='!!schemaPanel.visible' @on-close='onSchemaPanelClose')
    div(slot='header')
      span Schema
    ep-schema(
      v-if='schemaPanel.visible'
      v-model='rootSchema'
      :store='store'
    )
  ep-fullscreen(:visible='!!logicPanel.visible' @on-close='onLogicPanelClose')
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
import {
  getIcon,
  IVIEW_V3,
  MAIN_VERSION
} from './util/iview-patch'

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
const defaultSetting = () => ({
  name: true,
  title: true,
  placeholder: true,
  description: true,
  help: true,
  hidden: true,
  disabled: true,
  rule: true
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
        view: 'pc',
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
      setting: defaultSetting(),
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
      },
      icon: {
        design: 'compose',
        preview: 'eye',
        logic: 'network',
        schema: 'code-working'
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
    Object.assign(this.setting, ext.setting)
    this.settings = ext.settings
    this.design.view = ext.view || 'pc'
    this.setReady()
    this.setIcon()
  },
  mounted () {
    this.renderDesignView(this.design.view)
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
    onShowSchemaPanel () {
      this.schemaPanel.visible = true
    },
    onSchemaPanelClose () {
      this.schemaPanel.visible = false
    },
    onShowLogicPanel () {
      this.logicPanel.visible = true
    },
    onLogicPanelClose () {
      this.logicPanel.visible = false
    },
    onPreviewChange (view) {
      this.renderPreview(view)
    },
    onPreviewClose () {
      this.preview.view = ''
      const { mobile, pc } = this.preview
      this.destoryView(mobile)
      this.destoryView(pc)
    },
    destoryView (view) {
      if (!view) return
      if (!helper.isFunction(view.destroy)) return
      view.destroy()
    },
    /**
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
      const { setRender, callPlugin, Render, widgets, main } = ext

      this[mode].view = view
      if (!helper.include(VIEWS, view)) return
      const ins = this.getIns(view)

      if (!ins) return
      const _Render = Render || ext[view].Render
      const _widgets = widgets || ext[view].widgets
      const _main = main || ext[view].main

      if (!_Render || !_widgets || !_widgets.length || !_main) return

      const args = { el, mode: 'edit' }
      if (mode === 'design') {
        this.store.initWidgets(_widgets)
        args.store = this.store
      } else {
        args.schema = schema
        args.widgets = _widgets
      }
      args.component = _main
      args.callPlugin = callPlugin

      this[mode][view] = new _Render(args)
      if (mode === 'design') {
        setRender(this.design[view])
      }
      if (view === 'pc') this.destoryView(mobile)
      if (view === 'mobile') this.destoryView(pc)
    },
    renderPreview (view) {
      this.renderView(view, 'preview')
    },
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
    setIcon () {
      // 兼容iview@3+ 新icon方案
      if (MAIN_VERSION >= IVIEW_V3) {
        Object.assign(this.icon, getIcon(2, this.icon))
      }
    },
    onAddWidget (widget) {
      this.store.addWidget(widget)
    }
  }
}
</script>
