<template lang="pug">
setting-form(:store='store' :setting='setting')
  FormItem(label='密码')
    i-switch(v-model='selectedSchema.option.password')
      span(slot='open') 是
      span(slot='close') 否
  FormItem(label='前置文字')
    Input(size='small' v-model='selectedSchema.option.prefix' placeholder='请输入前置文字')
  FormItem(label='后置文字')
    Input(size='small' v-model='selectedSchema.option.suffix' placeholder='请输入后置文字')
</template>
<script>
import settingExtend from '../../extends/setting'
export default {
  extends: settingExtend
}
</script>
