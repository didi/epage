<template lang="pug">
setting-form(:store='store')
  span(slot='label')
  span(slot='description')
  span(slot='placeholder')
  span(slot='name')
  span(slot='rule')
  span(slot='help')

  FormItem(v-if='!$slots.text' label='文字')
    Input(size='small' v-model='selectedSchema.option.text')
  template(v-else)
    slot(name='text')

  FormItem(v-if='!$slots.long' label='长度')
    Checkbox(size='small' v-model='selectedSchema.option.long') 通栏
  template(v-else)
    slot(name='long')

  FormItem(v-if='!$slots.shape' label='形状')
    RadioGroup(v-model='selectedSchema.option.shape' size='small')
      Radio(label='circle') 圆角
      Radio(label='square') 方角
  template(v-else)
    slot(name='shape')

  FormItem(v-if='!$slots.type' label='类型')
    RadioGroup(v-model='selectedSchema.option.type' size='small')
      Radio(label='default') Default
      Radio(label='ghost') Ghost
      Radio(label='dashed') Dashed
      Radio(label='primary') Primary
      Radio(label='text') Text
  template(v-else)
    slot(name='type')

  FormItem(v-if='!$slots.actionType' label='按钮类型')
    RadioGroup(v-model='selectedSchema.option.actionType' size='small')
      Radio(label='submit') 提交
      Radio(label='reset') 重置
      Radio(label='goback') 返回
  template(v-else)
    slot(name='actionType')

  template(v-if='selectedSchema.option.actionType === "submit"')
    FormItem(label='提交地址')
      Input(v-model='selectedSchema.option.url' size='small' placeholder='请输入URL')
    FormItem(label='方法')
      RadioGroup(v-model='selectedSchema.option.method' size='small')
        Radio(label='GET') GET
        Radio(label='POST') POST
        Radio(label='PUT') PUT
        Radio(label='DELETE') DELETE

  template(v-else-if='selectedSchema.option.actionType === "goback"')
    span goback

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend
}
</script>
