<template lang="pug">
.ep-editor
  .ep-tool
    epage-tool(:widgets='widgets' @on-add='onAddWidget')

  .ep-work
    .ep-work-btns
      Button(type='primary' size='small' icon='soup-can-outline' @click='getSchema') 获取schema
      Button(type='primary' size='small' icon='ios-paper' @click='getFormData' style='margin-left: 10px;') 获取数据
      Button(type='primary' size='small' icon='soup-can-outline' @click='validateForm' style='margin-left: 10px;') 校验

    Tabs.ep-work-tabs(v-model='tab' size='small' @on-click='renderView')
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

  .ep-setting
    epage-setting(:store='store' :setting='setting')

</template>
<script>
import { version } from 'iview'
import EpagePanel from '../components/panel'
import { EpageTool, EpageSchema, EpageLogic, EpageSetting } from '../panel'
import { helper } from '../modules'
import { IVIEW_V3 } from '../modules/constant/static'
import { map2to3 } from '../modules/constant/icon-type-map'
// import '../style/main.less'
const mainVersion = parseInt(version || 2)
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

const APPS = {
  design: null,
  preview: null
}

export default {
  components: {
    EpagePanel,
    EpageTool,
    EpageLogic,
    EpageSchema,
    EpageSetting
  },
  data () {
    return {
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
    setIcon () {
      // 兼容iview@3+ 新icon方案
      if (mainVersion >= IVIEW_V3) {
        const { icon } = this
        const _icon = {}
        if (icon.design in map2to3) _icon.design = map2to3[icon.design]
        if (icon.preview in map2to3) _icon.preview = map2to3[icon.preview]
        if (icon.logic in map2to3) _icon.logic = map2to3[icon.logic]
        if (icon.schema in map2to3) _icon.schema = map2to3[icon.schema]

        Object.assign(this.icon, _icon)
      }
    },
    renderView (tab) {
      const { Render } = this.$root.$options.extension
      const el = this.$refs[tab]
      this.store.updateTab(tab)
      if (tab === 'preview') {
        const schema = this.store.getSchema()
        const widgets = this.store.getWidgets()

        if (APPS[tab] && helper.isFunction(APPS[tab].destroy)) {
          APPS[tab].destroy()
        }
        /* eslint-disable no-new */
        APPS[tab] = new Render({ el, widgets, schema, mode: 'edit' })
        APPS[tab].store.updateTab(tab)
      } else if (tab === 'design') {
        if (!APPS[tab]) {
          /* eslint-disable no-new */
          APPS[tab] = new Render({ el, store: this.store, mode: 'edit' })
        }
      }
    },
    onAddWidget (widget) {
      this.store.addWidget(widget)
    },
    validateForm (form) {
      APPS[this.tab].validateFields().then(args => {
        console.log('validate: ', args)
      })
    },
    getSchema () {
      const { getSchema } = this.$root.$options.extension
      const { option } = this.rootSchema
      const { url, ..._option } = option
      const schema = helper.getSchema(this.rootSchema)
      if (helper.isFunction(getSchema)) {
        return getSchema(schema)
      }
      const args = Object.assign({}, _option, { body: JSON.stringify(schema) })
      return fetch(url, args)
    },
    getFormData () {
      const { getFormData } = this.$root.$options.extension
      let formData = {}
      if (APPS.preview) {
        // const flatSchemas = APPS.preview.store.getFlatSchemas()
        const model = APPS.preview.store.getModel()
        const rootSchema = APPS.preview.store.getRootSchema()
        formData = helper.getFormData(model, rootSchema)
      }

      if (helper.isFunction(getFormData)) {
        return getFormData(formData)
      }
      console.log('model: ', formData)
    }
  }
}
</script>
