<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot="rule")
  span(slot="placeholder")

  FormItem(v-if='!$slots.open' label='开文本')
    Input(v-model='selectedSchema.option.open' size='small')
  template(v-else)
    slot(name='open')

  FormItem(v-if='!$slots.close' label='关文本')
    Input(v-model='selectedSchema.option.close' size='small')
  template(v-else)
    slot(name='close')

</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend
}
</script>
