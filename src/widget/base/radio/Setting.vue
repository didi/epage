<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot="placeholder")

  data-source(:store='store' @success='onSuccess')

  template(v-if='!$slots.defaultValue')
    FormItem(v-if='selectedSchema.option.type === "static"' label='默认值')
      RadioGroup(
        size='small'
        v-model='selectedSchema.default'
      )
        Radio(
          v-for='(item, k) in selectedSchema.option.data'
          :key='item.key'
          :label='item.key'
        ) {{item.value}}

  template(v-else)
    slot(name='defaultValue')

  FormItem(v-if='!$slots.direction' label='排列方式')
    RadioGroup(v-model='selectedSchema.option.direction' size='small')
      Radio(label='vertical') 垂直排列
      Radio(label='horizontal') 水平排列
  template(v-else)
    slot(name='direction')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'
import DataSource from '../../components/data-source'

export default {
  components: {
    DataSource
  },
  extends: settingExtend,
  methods: {
    onSuccess (dynamicData) {
      const key = this.selectedSchema.key
      this.store.updateWidgetOption(key, { dynamicData })
    }
  }
}
</script>
