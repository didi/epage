<template lang="pug">
setting-form(:store='store' :setting='setting')
  FormItem(v-if='!$slots.defaultValue' label='默认值')
    Input(
      size='small'
      type='textarea'
      v-model='selectedSchema.default'
      placeholder='请输入默认值'
    )
  template(v-else)
    slot(name='defaultValue')

  FormItem(v-if='!$slots.rows' label='高度')
    InputNumber(type='text' size='small' :min="1" placeholder='请输入高度' v-model='selectedSchema.option.rows')
  template(v-else)
    slot(name='rows')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend
}
</script>
