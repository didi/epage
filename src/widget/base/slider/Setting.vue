<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot='placeholder')

  FormItem(v-if='!$slots.min' label='最小值')
    InputNumber(v-model='selectedSchema.option.min' size='small')
  template(v-else)
    slot(name='min')

  FormItem(v-if='!$slots.max' label='最大值')
    InputNumber(v-model='selectedSchema.option.max' size='small')
  template(v-else)
    slot(name='max')

  FormItem(v-if='!$slots.step' label='步长')
    InputNumber(v-model='selectedSchema.option.step' size='small')
  template(v-else)
    slot(name='step')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend
}
</script>
