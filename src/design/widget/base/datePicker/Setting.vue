<template lang="pug">
setting-form(:store='store' :setting='setting')
  FormItem(v-if='!$slots.type' label='展示类型')
    i-switch(
      v-model='selectedSchema.option.range'
      @on-change="onTypeChange"
      size='large'
    )
      span(slot="open") 区间
      span(slot="close") 日期
  template(v-else)
    slot(name='type')

  FormItem(v-if='!$slots.format' label='日期格式')
    Select(
      v-model='dateFormat'
      :transfer='true'
      size='small'
    )
      Option(
        v-for='item in dateFormatOptions'
        :value='item'
        :key='item'
      ) {{item}}
  FormItem(v-if='!$slots.format && hasTime' label='时间格式')
    Select(
      v-model='timeFormat'
      :transfer='true'
      size='small'
    )
      Option(
        v-for='item in timeFormatOptions'
        :value='item'
        :key='item'
      ) {{item}}
  template(v-else)
    slot(name='format')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'
import { include } from '../../../../modules/helper'

export default {
  extends: settingExtend,
  data () {
    return {
      dateFormatOptions: [
        'yyyy',
        'yyyy-MM',
        'yyyy/MM',
        'yyyy-MM-dd',
        'yyyy/MM/dd',
        'MM-dd-yyyy',
        'MM/dd/yyyy'
      ],
      timeFormatOptions: [
        'HH:mm:ss',
        'mm:ss',
        '无'
      ],
      dateFormat: 'yyyy-MM-dd',
      timeFormat: '无'
    }
  },
  computed: {
    hasTime () {
      return include(this.dateFormat, 'dd')
    }
  },
  watch: {
    dateFormat () {
      this.updateFormat()
    },
    timeFormat () {
      this.updateFormat()
    }
  },
  created () {
    this.updateFormat()
  },
  methods: {
    getFormat () {
      const { dateFormat, timeFormat, hasTime } = this
      return dateFormat + (hasTime && timeFormat !== '无' ? ' ' + timeFormat : '')
    },
    onTypeChange (range) {
      const key = this.selectedSchema.key
      const widgetType = range ? 'array<string>' : 'string'

      // type 可以先改变，但是 value 先改变则会报错
      this.store.updateWidgetType(key, widgetType)
    },
    updateFormat () {
      const format = this.getFormat()
      const { key } = this.selectedSchema
      this.store.updateWidgetOption(key, { format })
    }
  }
}
</script>
