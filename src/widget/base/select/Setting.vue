<template lang="pug">
setting-form(:store='store' :setting='setting')
  data-source(:store='store' @success='onSuccess')

  template(v-if='!$slots.defaultValue')
    FormItem(v-if='selectedSchema.option.type === "static"' label='默认值')
      Select(
        placeholder='请选择默认值'
        size='small'
        transfer
        filterable
        :clearable="true"
        :multiple='selectedSchema.option.multiple'
        v-model='selectedSchema.default'
      )
        Option(
          v-for='(item, k) in getSchemaData()'
          :key='item.key'
          :value='item.key'
        ) {{item.value}}

  template(v-else)
    slot(name='defaultValue')

  FormItem(label='允许清空')
    i-switch(v-model='selectedSchema.option.clearable')

  FormItem(v-if='!$slots.multiple' label='是否多选')
    i-switch(v-model='selectedSchema.option.multiple')
      span(slot='open') 是
      span(slot='close') 否
  template(v-else)
    slot(name='multiple')

  slot
</template>
<script>
import { TypeBuilder } from 'epage-core'
import settingExtend from '../../extends/setting'
import DataSource from '../../components/data-source'

export default {
  components: {
    DataSource
  },
  extends: settingExtend,
  watch: {
    'selectedSchema.option.multiple' (value) {
      const { key, type } = this.selectedSchema
      const resolvedType = TypeBuilder.resolve(type)
      const newType = value ? `array<${resolvedType}>` : resolvedType
      this.store.updateWidgetType(key, newType)

      const defaultValue = newType.indexOf('array') > -1 ? [] : undefined
      this.store.updateWidgetDefault({ [key]: defaultValue })
    }
  },
  methods: {
    onSuccess (dynamicData) {
      const key = this.selectedSchema.key
      this.store.updateWidgetOption(key, { dynamicData })
    },
    getSchemaData () {
      return [...this.selectedSchema.option.data]
    }
  }
}
</script>
