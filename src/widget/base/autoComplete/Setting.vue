<template lang="pug">
setting-form(:store='store')

  FormItem(v-if='!$slots.clearable' label='允许清空')
    i-switch(v-model='selectedSchema.option.clearable')
  template(v-else)
    slot(name='clearable')

  data-source(:store='store' data-type="string" @success='onSuccess')

  FormItem(v-if='!$slots.defaultValue' label='默认值')
    Input(size='small' v-model='selectedSchema.default' placeholder='请输入默认值')
  template(v-else)
    slot(name='defaultValue')
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
