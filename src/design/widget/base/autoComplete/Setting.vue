<template lang="pug">
setting-form(:store='store' :setting='setting')
  FormItem(label='允许清空')
    i-switch(v-model='selectedSchema.option.clearable')

  data-source(:store='store' data-type="string" @success='onSuccess')
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
