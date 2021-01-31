<template lang="pug">
Tabs(:value='tab' size='small')

  TabPane(label='属性' name='prop')
    ep-panel.ep-setting-prop
      template(v-if='isSelected && settingWidget')
        component(:is='settingWidget' :store='store' :setting='setting')

  TabPane(
    label='样式'
    name='style'
    v-if='isShowSetting("style")'
  )
    ep-panel.ep-setting-form
      ep-style-setting(
        v-if='isSelected'
        :store='store'
        :schema='selectedSchema'
        :root='false'
      )

  TabPane(
    label='页面'
    name='global'
    v-if='isShowSetting("global")'
  )
    ep-panel.ep-setting-form
      form-setting(:store='store')

  TabPane(
    v-for='(s, index) in getFilterSettings()'
    :label='s.title'
    :key='s.key'
    :name='s.key'
  )
    ep-panel.ep-setting-form
      div(ref='panes')
</template>
<script>
import FormSetting from './form'
import EpStyleSetting from './style'
import { EpPanel } from '../../components'

export default {
  components: {
    FormSetting,
    EpStyleSetting,
    EpPanel
  },
  props: {
    // 自定义配置面板
    settings: {
      type: Array,
      // [{ title: '', key: '', component: {}}]
      default: () => []
    },
    setting: {
      type: Object,
      default: () => ({})
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
      tab: 'prop',
      filterSettings: []
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
    }
  },
  mounted () {
    const { Render } = this.$root.$options.extension
    const store = this.store
    const list = this.$refs.panes || []
    const filterSettings = this.getFilterSettings()

    list.forEach((el, index) => {
      const setting = filterSettings[index]
      if (setting && setting.component) {
        /* eslint-disable no-new */
        new Render({ el, store, component: setting.component })
      }
    })
  },
  methods: {
    isShowSetting (name) {
      return this.settings.filter(s => s.key === name).length === 0
    },
    getFilterSettings () {
      return this.settings.filter(setting => {
        return setting &&
        setting.component &&
        typeof setting.key === 'string' &&
        !!setting.key
      })
    }
  }
}
</script>
