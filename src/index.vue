<template lang="pug">
.ep-editor
  .ep-side-left

    .ep-side-left-nav
      .ep-side-left-nav-item(
        v-for='item in nav.list'
        :key='item.key'
        :class='{"ep-side-left-nav-active": nav.active === item.key}'
        @click='nav.active = item.key'
      ) {{item.value}}

    .ep-side-left-content
      .ep-tool(v-show='nav.active === "widget"')
        epage-tool(:widgets='widgets' @on-add='onAddWidget')
      epage-store(v-show='nav.active === "store"' :store='store')

  .ep-work(:class='{"ep-work-expand": settingState.fold}')
    epage-store-setting(v-show='nav.active === "store"' :store='store')

    Tabs.ep-work-tabs(
      v-show='nav.active === "widget"'
      v-model='tab'
      size='small'
      @on-click='renderView')
      TabPane(label='设计' name='design' :icon='icon.design')
        epage-panel.ep-work-design
          div(ref='design')

      TabPane(v-if='panels.preview' label='预览' name='preview' :icon='icon.preview')
        epage-panel.ep-work-preview
          div(ref='preview')

      TabPane(v-if='panels.logic' label='逻辑' name='logic' :icon='icon.logic')
        epage-panel.ep-work-logic
          epage-logic(v-if='tab === "logic"' :store='store')

      TabPane(v-if='panels.schema' label='Schema' name='schema' :icon='icon.schema')
        epage-panel.ep-work-schema
          epage-schema(v-if='tab === "schema"' v-model='rootSchema' :store='store')

  .ep-setting(:class='{"ep-setting-fold": settingState.fold}')
    epage-setting(:store='store' :setting='setting')
    .ep-control-handle(@click='onUnfold') {{settingState.text}}

</template>
<script>
import { helper } from 'epage-core'
import EpagePanel from './components/panel'
import {
  EpageStore,
  EpageStoreSetting,
  EpageTool,
  EpageSchema,
  EpageLogic,
  EpageSetting
} from './panel'
import {
  getIcon,
  IVIEW_V3,
  MAIN_VERSION
} from './util/iview-patch'

const defaultPanels = () => ({
  preview: true,
  logic: true,
  schema: true
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
    EpagePanel,
    EpageStore,
    EpageStoreSetting,
    EpageTool,
    EpageLogic,
    EpageSchema,
    EpageSetting
  },
  data () {
    return {
      nav: {
        list: [{
          key: 'widget',
          value: '物料'
        }, {
          key: 'store',
          value: '仓库'
        }],
        active: 'store' // widget | store
      },
      APPS: {
        design: null,
        preview: null
      },
      settingState: {
        fold: false,
        text: '收起'
      },
      env: process.env.NODE_ENV,
      tab: 'design',
      panels: defaultPanels(),
      setting: defaultSetting(),
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
    const { panels, setting } = this.$root.$options.extension
    Object.assign(this.panels, panels)
    Object.assign(this.setting, setting)
    this.setIcon()
  },
  mounted () {
    this.renderView('design')
  },
  methods: {
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
    renderView (tab) {
      const { Render, setRender } = this.$root.$options.extension
      const el = this.$refs[tab]
      this.store.updateTab(tab)

      if (tab === 'preview') {
        const schema = this.store.getSchema()
        const widgets = this.store.getWidgets()

        if (this.APPS[tab] && helper.isFunction(this.APPS[tab].destroy)) {
          this.APPS[tab].destroy()
        }
        /* eslint-disable no-new */
        this.APPS[tab] = new Render({ el, widgets, schema, mode: 'edit' })
        this.APPS[tab].store.updateTab(tab)
        setRender(this.APPS[tab])
      } else if (tab === 'design') {
        if (!this.APPS[tab]) {
          /* eslint-disable no-new */
          this.APPS[tab] = new Render({ el, store: this.store, mode: 'edit' })
          setRender(this.APPS[tab])
        }
      }
    },
    onAddWidget (widget) {
      this.store.addWidget(widget)
    }
  }
}
</script>
