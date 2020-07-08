<template lang="pug">
setting-form(:store='store' :setting='setting')
  data-source(:store='store' @success='onSuccess')

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
import settingExtend from '../../extends/setting'
import DataSource from '../../components/data-source'
import TypeBuilder from '../../../../modules/store/TypeBuilder'

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
    }
  },
  methods: {
    onSuccess (dynamicData) {
      const key = this.selectedSchema.key
      this.store.updateWidgetOption(key, { dynamicData })
    }
  }
}
</script>
