<template lang="pug">
setting-form(:store='store')
  FormItem(v-if='!$slots.defaultValue' label='默认值')
    Input(size='small' v-model='selectedSchema.default' placeholder='请输入默认值')
  template(v-else)
    slot(name='defaultValue')

  FormItem(v-if='!$slots.password' label='密码')
    i-switch(v-model='selectedSchema.option.password')
      span(slot='open') 是
      span(slot='close') 否
  template(v-else)
    slot(name='password')

  FormItem(v-if='!$slots.prefix' label='前置文字')
    Input(size='small' v-model='selectedSchema.option.prefix' placeholder='请输入前置文字')
  template(v-else)
    slot(name='prefix')

  FormItem(v-if='!$slots.suffix' label='后置文字')
    Input(size='small' v-model='selectedSchema.option.suffix' placeholder='请输入后置文字')
  template(v-else)
    slot(name='suffix')
</template>
<script>
import settingExtend from '../../extends/setting'
export default {
  extends: settingExtend
}
</script>
