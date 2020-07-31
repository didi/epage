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

  template(v-if='!$slots.defaultValue')
    FormItem(label='默认值')
      Checkbox(
        :value='selectedSchema.default === "usetime"'
        @on-change="onUsetimeChange"
      ) 使用时日期

    FormItem(v-if='dynamicTime.indexOf(selectedSchema.default) === -1' label=' ')
      TimePicker(
        :transfer='true'
        :type='type'
        :format='selectedSchema.option.format'
        placeholder='请选择默认时间'
        size='small'
        v-model='selectedSchema.default'
      )
  template(v-else)
    slot(name='defaultValue')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend,
  data () {
    return {
      dynamicTime: [
        'usetime' // 使用时时间
      ]
    }
  },
  computed: {
    formatOptions () {
      return [
        'HH:mm:ss',
        'HH:mm'
      ]
    },
    type () {
      return this.selectedSchema.option.range ? 'timerange' : 'time'
    }
  },
  methods: {
    onRangeChange (range) {
      const { key } = this.selectedSchema
      const widgetType = range ? 'array<string>' : 'string'
      this.store.updateWidgetType(key, widgetType)
    },
    onUsetimeChange (isUsetime) {
      const { key, option } = this.selectedSchema
      if (isUsetime) {
        this.store.updateWidgetDefault({ [key]: 'usetime' })
      } else {
        this.updateDefaultValue(option.range)
      }
    },
    updateDefaultValue (range) {
      const { key } = this.selectedSchema
      const value = range ? [] : ''
      this.store.updateWidgetDefault({ [key]: value })
    }
  }
}
</script>
