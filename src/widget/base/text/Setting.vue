<template lang="pug">
setting-form(:store='store')
  span(slot='name')
  span(slot='label')
  span(slot='placeholder')
  span(slot='description')
  span(slot='help')
  span(slot='disabled')
  FormItem(v-if='!$slots.content' label='内容')
    Input(
      size='small'
      type='textarea'
      v-model='selectedSchema.option.content'
      :autosize='{ minRows: 6, maxRows: 16 }'
      placeholder='请输入内容，支持双花括号表达式'
    )
  template(v-else)
    slot(name='content')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend
}
</script>
