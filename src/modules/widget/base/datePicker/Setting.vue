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
import { include } from '../../../helper'

export default {
  extends: settingExtend,
  data() {
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
        'HH:mm',
        'mm:ss',
        '无'
      ],
      type: 'date',
      dateFormat: 'yyyy-MM-dd',
      timeFormat: '无'
    }
  },
  created () {
    this.updateType()
  },
  computed: {
    formatVal () {
      return this.getFormat()
    },
    hasTime () {
      return include(this.dateFormat, 'dd')
    }
  },
  watch: {
    type (newVal, oldval) {
      const key = this.selectedSchema.key
      if (newVal !== oldval) {
        this.store.updateWidgetOption(key, {'type': newVal, 'format': this.formatVal})
      }
    },
    dateFormat () {
      this.updateType()
    },
    timeFormat () {
      this.updateType()
    }
  },
  methods: {
    getFormat () {
      const { dateFormat, timeFormat, hasTime } = this
      return this.dateFormat + (hasTime && this.timeFormat !== '无' ? ' ' + timeFormat : '')
    },
    onTypeChange (range) {
      const key = this.selectedSchema.key
      const widupdateType = range ? 'array<string>' : 'string'
      
      // type 可以先改变，但是 value 先改变则会报错
      this.updateType()
      this.$nextTick(()=>{
        this.store.updateWidgetType(key, widupdateType)
      })
    },
    updateType () {
      const timeOptions = ['HH:mm:ss', 'HH:mm', 'mm:ss']
      const monthOptions = ['yyyy-MM', 'yyyy/MM']
      const format = this.getFormat()
      const { range } = this.selectedSchema.option
      let type = 'date'

      if (range) {
        type = this.hasTime && include(timeOptions, this.timeFormat) ? 'datetimerange' : 'daterange'
      } else {
        if (format === 'yyyy') {
          type = 'year'
        } else if (include(monthOptions, this.dateFormat)) {
          type = 'month'
        } else if (this.hasTime && include(timeOptions, this.timeFormat)) {
          type = 'datetime'
        } else {
          type = 'date'
        }
      }
      this.type = type
    }
  }
}
</script>
