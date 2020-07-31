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

  template(v-if='!$slots.defaultValue')
    FormItem(label='默认值')
      Checkbox(
        :value='selectedSchema.default === "usedate"'
        @on-change="onUsedateChange"
      ) 使用时日期

    FormItem(v-if='dynamicDate.indexOf(selectedSchema.default) === -1' label=' ')
      DatePicker(
        :transfer='true'
        placeholder='请选择默认日期'
        size='small'
        :type='getType()'
        :format='selectedSchema.option.format'
        :value="selectedSchema.default"
        @on-change="onDateChange"
        style='width: 100%;'
      )
  template(v-else)
    slot(name='defaultValue')

  slot
</template>
<script>
import { helper } from 'epage-core'
import settingExtend from '../../extends/setting'

const { include } = helper
const timeOptions = ['HH:mm:ss', 'HH:mm', 'mm:ss']
const monthOptions = ['yyyy-MM', 'yyyy/MM']

export default {
  extends: settingExtend,
  data () {
    return {
      dynamicDate: [
        'usedate' // 使用时日期
      ],
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
    onUsedateChange (isUsedate) {
      const { key, option } = this.selectedSchema
      if (isUsedate) {
        this.store.updateWidgetDefault({ [key]: 'usedate' })
      } else {
        this.updateDefaultValue(option.range)
      }
    },
    getFormat () {
      const { dateFormat, timeFormat, hasTime } = this
      return dateFormat + (hasTime && timeFormat !== '无' ? ' ' + timeFormat : '')
    },
    updateDefaultValue (range) {
      const { key } = this.selectedSchema
      const value = range ? [] : ''
      this.store.updateWidgetDefault({ [key]: value })
    },
    onTypeChange (range) {
      const { key } = this.selectedSchema
      const widgetType = range ? 'array<string>' : 'string'

      // type 可以先改变，但是 value 先改变则会报错
      this.store.updateWidgetType(key, widgetType)
      this.updateDefaultValue(range)
    },
    updateFormat () {
      const format = this.getFormat()
      const { key, option } = this.selectedSchema

      this.store.updateWidgetOption(key, { format })
      this.updateDefaultValue(option.range)
    },
    onDateChange (value) {
      const { key, default: defaultValue } = this.selectedSchema
      const newValue = value
      const oldValue = defaultValue

      if (newValue !== oldValue) {
        this.store.updateWidgetDefault({ [key]: newValue })
      }
    },
    formatHasTime (format) {
      return !!timeOptions.filter(t => include(format, t)).length
    },

    isMonth (format) {
      return !!monthOptions.filter(t => include(format, t)).length && !include(format, 'dd')
    },
    getType () {
      const { option } = this.selectedSchema
      const { range, format } = option
      let type = 'date'

      if (range) {
        type = this.formatHasTime(format) ? 'datetimerange' : 'daterange'
      } else {
        if (format === 'yyyy') {
          type = 'year'
        } else if (this.isMonth(format)) {
          type = 'month'
        } else if (this.formatHasTime(format)) {
          type = 'datetime'
        } else {
          type = 'date'
        }
      }
      return type
    }
  }
}
</script>
