<template lang="pug">
setting-form(:store='store' :setting='setting')

  FormItem(v-if='!$slots.type' label='展示类型')
    i-switch(
      v-model='selectedSchema.option.range'
      @on-change="onRangeChange"
      size='large'
    )
      span(slot="open") 区间
      span(slot="close") 时间
  template(v-else)
    slot(name='type')

  FormItem(v-if='!$slots.format' label='格式')
    Select(
      v-model='selectedSchema.option.format'
      :transfer='true'
      size='small'
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
    onRangeChange (range) {
      const { key } = this.selectedSchema
      const widgetType = range ? 'array<string>' : 'string'
      this.store.updateWidgetType(key, widgetType)
    }
  }
}
</script>
