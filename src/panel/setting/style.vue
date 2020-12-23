<template lang="pug">
.ep-setting-style
  Form(v-if='selectedSchema.style')
    FormItem(label='展示类型')
      RadioGroup(size='small' v-model='selectedSchema.style.display')
        Radio(label='block') 块元素
        Radio(label='inline-block') 行内块元素
    FormItem(label='字号' :label-width='60')
      Input(size='small' v-model='selectedSchema.style["font-size"]')
    Row
      Col(span='12')
        FormItem(label='高度' :label-width='60')
          Input(size='small' v-model='selectedSchema.style.height')
      Col(span='12')
        FormItem(label='宽度' :label-width='60')
          Input(size='small' v-model='selectedSchema.style.width')
    ep-bounding(
      title='外边距'
      type='margin'
      :styles='selectedSchema.style'
    )
    ep-bounding(
      title='内边距'
      type='padding'
      :styles='selectedSchema.style'
    )
    ep-bounding(
      title='定位'
      type='position'
      :styles='selectedSchema.style'
    )
      template(slot='before')
        FormItem(
          label='类型'
          :label-width='60'
        )
          RadioGroup(size='small' v-model='selectedSchema.style.position')
            Radio(label='relative') 默认
            Radio(label='absolute') 绝对
            Radio(label='fixed') 固定
            Radio(label='sticky') 粘性
        FormItem(
          label='层级'
          :label-width='60'
        )
          Input(size='small' v-model='selectedSchema.style["z-index"]')

  div(v-else style='text-align:center;padding-top: 20px;color:#666;') 请先选中 widget
</template>
<script>
import { settingExtend } from '../../widget/setting'
import EpBounding from '../../components/bounding'

export default {
  components: {
    EpBounding
  },
  extends: settingExtend
}
</script>
