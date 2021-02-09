<template lang="pug">
ep-tabs(
  :value='tab'
  :tabs='widgetSettings'
  @on-click='onChangeTab'
)
  ep-tabs-pane(
    v-for='(item, index) in widgetSettings'
    :key='index'
    v-show='item.key === tab'
  )
    .ep-setting-prop
      component(
        v-if='isVue(item)'
        :is='item.component'
        :store='store'
        :schema='selectedSchema'
        :root='item.key === "global"'
      )
      div(v-show='!isVue(item)' ref='settings')

</template>
<script>
import { helper, render } from 'epage-core'
import FormSetting from './form'
import EpStyleSetting from './style'
import { EpPanel, EpTabs, EpTabsPane } from '../../components'

const { isArray, isFunction, isPlainObject, isString } = helper
const globalDefaultSettings = [
  {
    key: 'style',
    name: '样式',
    framework: 'vue',
    component: EpStyleSetting
  }, {
    key: 'global',
    name: '页面',
    framework: 'vue',
    component: FormSetting
  }
]

export default {
  components: {
    FormSetting,
    EpPanel,
    EpTabs,
    EpTabsPane
  },
  props: {
    // 自定义配置面板
    settings: {
      type: Array,
      // [{ title: '', key: '', component: {}}]
      default: () => []
    },
    store: {
      type: Object,
      default: () => ({
        types: {},
        state: {}
      })
    }
  },
  data () {
    return {
      tab: 'global',
      filterSettings: [],
      defaultSettings: [...globalDefaultSettings]
    }
  },
  computed: {
    // 是否有选中的组件
    isSelected () {
      return this.store.isSelected()
    },
    settingWidget () {
      return this.store.getSettingWidget()
    },
    selectedSchema () {
      return this.store.getSelectedSchema()
    },
    widgetSettings () {
      return this.isSelected ? this.filterSettings : this.defaultSettings
    }
  },
  watch: {
    selectedSchema () {
      this.selectedSettings()
    }
  },
  mounted () {
    this.selectedSettings()
  },
  methods: {
    isVue (setting) {
      return setting &&
      (
        setting.framework === 'vue' ||
        isPlainObject(setting.component))
    },
    isReact (setting) {
      return setting && setting.framework === 'react'
    },
    onChangeTab (key, index) {
      if (!key || key === this.tab) return
      this.tab = key
      this.renderCurrentSetting(index)
    },
    selectedSettings () {
      const defaultSettings = [...globalDefaultSettings]
      const globalSettings = [...this.settings]
      let settings = []

      if (isArray(this.settingWidget)) {
        settings = settings.concat(this.settingWidget)

      // function ({ el, store }) {}
      } else if (isFunction(this.settingWidget)) {
        settings.unshift({
          key: 'prop',
          name: '属性',
          component: this.settingWidget
        })

      // default vue component
      // { el, data, render, ... }
      } else if (isPlainObject(this.settingWidget)) {
        settings.unshift({
          key: 'prop',
          name: '属性',
          framework: 'vue',
          component: this.settingWidget
        })
      }
      let result = []
      result = [].concat(settings, globalSettings, defaultSettings)
      result = this.unique(result)

      if (this.isSelected) {
        this.filterSettings = [...result]
      } else {
        this.defaultSettings = [...result]
      }
      this.renderSettings()
    },
    renderCurrentSetting (index) {
      this.$nextTick(() => {
        const els = this.$refs.settings
        if (!els || els.length <= 0) return

        const el = els[index]
        const setting = this.widgetSettings[index]
        if (isFunction(setting.component)) {
          setting.component({ el, store: this.store })
        }
      })
    },
    renderSettings () {
      this.$nextTick(() => {
        const els = this.$refs.settings
        if (
          !els ||
          els.length <= 0 ||
          els.length !== this.widgetSettings.length
        ) return

        this.widgetSettings.forEach((setting, index) => {
          const el = els[index]
          const { component } = setting

          if (this.isReact(setting)) {
            /* eslint-disable no-new */
            new render.ReactRender({ el, store: this.store, component })
          } else if (isFunction(component)) {
            component({ el, store: this.store })
          }
        })
      })
    },

    unique (settings = []) {
      const keys = {}
      return settings.filter(setting => {
        if (!setting || !setting.component) return false
        if (!setting.key || !isString(setting.key)) return false
        if (setting.key in keys) return false
        keys[setting.key] = true
        return true
      })
    }
  }
}
</script>
