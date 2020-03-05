<template lang="pug">
setting-form(:store='store' :setting='setting')

  FormItem(v-if='!$slots.type' label='展示类型')
    Select(
      v-model='selectedSchema.option.type'
      :transfer='true'
      size='small'
      @on-change="onTypeChange"
    )
      Option(value='time') 时间
      Option(value='timerange') 时间区间
  template(v-else)
    slot(name='type')

  FormItem(v-if='!$slots.format' label='格式')
    Select(
      v-model='selectedSchema.option.format'
      :transfer='true'
      size='small'
      @on-change="onFormatChange"
    )
      Option(v-for='item in formatOptions' :value='item' :key='item') {{item}}
  template(v-else)
    slot(name='format')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend,
  computed: {
    formatOptions () {
      return [
        'HH:mm:ss',
        'HH:mm',
        'mm:ss'
      ]
    }
  },
  methods: {
    onTypeChange (type) {
      const key = this.selectedSchema.key
      const isRange = ['timerange'].indexOf(type) > -1
      const widgetType = isRange ? 'array<string>' : 'string'

      this.store.updateWidgetOption(key, { type: type, format: 'HH:mm:ss' })
      this.$nextTick(() => {
        this.store.updateWidgetType(key, widgetType)
      })
    },
    onFormatChange (value) {
      const key = this.selectedSchema.key

      this.store.updateWidgetOption(key, { format: value })
    }
  }
}
</script>
