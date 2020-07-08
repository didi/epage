<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot="placeholder")

  data-source(:store='store' @success='onSuccess')

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
