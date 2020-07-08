<template lang="pug">
setting-form(:store='store' :setting='setting')

  FormItem(v-if='!$slots.min' label='最小值')
    InputNumber(v-model='selectedSchema.option.min' :transfer='true' size='small')
  template(v-else)
    slot(name='min')

  FormItem(v-if='!$slots.max' label='最大值')
    InputNumber(v-model='selectedSchema.option.max' :transfer='true' size='small')
  template(v-else)
    slot(name='max')

  FormItem(v-if='!$slots.step' label='步长')
    InputNumber(v-model='selectedSchema.option.step' :transfer='true' size='small' :min='0')
  template(v-else)
    slot(name='step')

  FormItem(v-if='!$slots.precision' label='精度')
    InputNumber(v-model='selectedSchema.option.precision' :transfer='true' size='small' :min='0')
  template(v-else)
    slot(name='precision')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend
}
</script>
