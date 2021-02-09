<template lang="pug">
setting-form(:store='store')
  span(slot="rule")
  span(slot="placeholder")

  FormItem(v-if='!$slots.defaultValue' label='默认值')
    i-switch(v-model='selectedSchema.default')
      span(
        v-if='selectedSchema.option.open'
        slot='open'
      ) {{selectedSchema.option.open}}
      span(
        v-if='selectedSchema.option.close'
        slot='close'
      ) {{selectedSchema.option.close}}
  template(v-else)
    slot(name='defaultValue')

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
