<template lang="pug">
Form.ep-setting-style(v-if='schema.style')
  slot(name='before')
  FormItem(v-if='!$slots.display' label='展示类型')
    RadioGroup(size='small' v-model='schema.style.display')
      Radio(label='block') 块元素
      Radio(label='inline-block') 行内块元素
  template(v-else)
    slot(name='display')

  ep-setting-block(v-if='!$slots.font' title='文字配置')
    Row
      //- Col(span='12')
      //-   FormItem(label='字号' :label-width='60')
      //-     Input(size='small' v-model='schema.style["font-size"]')
      Col(span='24' v-if='typeof schema.style.color === "string"')
        Row
          Col(span='10')
            FormItem(label='文字色' :label-width='60')
              ColorPicker.ep-style-color-picker(
                v-model='schema.style.color'
                size='small'
                :alpha='true'
              )
          Col(span='14')
            FormItem(label='RGB值' :label-width='60')
              Input(size='small' v-model='schema.style.color')
      Col(span='24')
        FormItem(label='粗细' :label-width='60')
          RadioGroup(size='small' v-model='schema.style["font-weight"]')
            Radio(label='100') 最细
            Radio(label='200') 细
            Radio(label='400') 正常
            Radio(label='700') 粗
      Col(span='24')
        FormItem(label='对齐' :label-width='60')
          RadioGroup(size='small' v-model='schema.style["text-align"]')
            Radio(label='left') 左
            Radio(label='center') 中
            Radio(label='right') 右
  template(v-else)
    slot(name='font')

  ep-setting-block(v-if='!$slots.area' title='宽高配置')
    Row
      Col(span='12')
        FormItem(label='宽度' :label-width='60')
          Input(size='small' v-model='schema.style.width')
      Col(span='12')
        FormItem(label='高度' :label-width='60')
          Input(size='small' v-model='schema.style.height')
      Col(span='12')
        FormItem(label='最大宽' :label-width='60')
          Input(size='small' v-model='schema.style["max-width"]')
      Col(span='12')
        FormItem(label='最大高' :label-width='60')
          Input(size='small' v-model='schema.style["max-height"]')
      Col(span='12')
        FormItem(label='最小宽' :label-width='60')
          Input(size='small' v-model='schema.style["min-width"]')
      Col(span='12')
        FormItem(label='最小高' :label-width='60')
          Input(size='small' v-model='schema.style["min-height"]')
  template(v-else)
    slot(name='area')

  ep-setting-bounding(
    v-if='!$slots.margin'
    title='外边距'
    type='margin'
    :styles='schema.style'
  )
  template(v-else)
    slot(name='margin')

  ep-setting-bounding(
    v-if='!$slots.padding'
    title='内边距'
    type='padding'
    :styles='schema.style'
  )
  template(v-else)
    slot(name='padding')

  ep-setting-bounding(
    v-if='$slots.position'
    title='位置'
    type='position'
    :styles='schema.style'
  )
    template(slot='before')
      FormItem(
        label='类型'
        :label-width='60'
      )
        RadioGroup(size='small' v-model='schema.style.position')
          Radio(label='relative') 默认
          Radio(label='absolute') 绝对
          Radio(label='fixed') 固定
          Radio(label='sticky') 粘性
      FormItem(
        label='层级'
        :label-width='60'
      )
        Input(
          size='small'
          placeholder='请输入整数'
          v-model='schema.style["z-index"]'
        )
  template(v-else)
    slot(name='position')
  ep-setting-background(
    v-if='schema.style.container'
    title='背景设置'
    :schema='schema'
    :store='store'
    :root='root'
  )
  slot
</template>
<script>
import {
  EpSettingBounding,
  EpSettingBlock,
  EpSettingBackground
} from '../../components'

export default {
  components: {
    EpSettingBounding,
    EpSettingBlock,
    EpSettingBackground
  },
  props: {
    schema: {
      type: Object,
      default: () => ({
        style: {}
      })
    },
    root: {
      type: Boolean,
      default: true
    },
    store: {
      type: Object,
      default: () => ({ state: {} })
    }
  }
}
</script>
