<template lang="pug">
Tabs(:value='tab' size='small')
  a.ep-setting-help-link(slot="extra" :href='docURL' target='_blank')
    Icon(type="help")
    span &nbsp;帮助

  TabPane(label='属性' name='prop')
    epage-panel.ep-setting-prop
      template(v-if='isSelected && settingWidget')
        component(:is='settingWidget' :store='store' :setting='setting')

  TabPane(
    label='样式'
    name='style'
    v-if='isShowSetting("style")'
  )
    epage-panel.ep-setting-form
      style-setting(:store='store')
  TabPane(
    label='页面'
    name='global'
    v-if='isShowSetting("global")'
  )
    epage-panel.ep-setting-form
      form-setting(:store='store')

  TabPane(
    v-for='(s, index) in getFilterSettings()'
    :label='s.title'
    :key='s.key'
    :name='s.key'
  )
    epage-panel.ep-setting-form
      div(ref='panes')
</template>
<script>
import FormSetting from './form'
import StyleSetting from './style'
import EpagePanel from '../../components/panel'

export default {
  components: {
    FormSetting,
    StyleSetting,
    EpagePanel
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
      docURL: 'http://epage.didichuxing.com',
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
