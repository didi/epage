<template lang="pug">
.ep-style
  FormItem(label='最大宽度')
    Input( size='small' placeholder='示例: 1200px 或 90%' v-model='styles["max-width"]')
  FormItem(label='最小宽度')
    Input( size='small' placeholder='示例: 1200px 或 90%' v-model='styles["min-width"]')

  .ep-setting-block
    h5.ep-setting-block-title 外边距
    Row(style='padding-top: 8px;')
      Col(span='8' offset='2')
        FormItem(label='上' :label-width='20')
          Input( size='small' v-model='styles["margin-top"]')
        FormItem(label='下' :label-width='20')
          Input( size='small' v-model='styles["margin-bottom"]')
      Col(span='8' offset='2')
        FormItem(label='左' :label-width='20')
          Input( size='small' v-model='styles["margin-left"]')
        FormItem(label='右' :label-width='20')
          Input( size='small' v-model='styles["margin-right"]')

  .ep-setting-block
    h5.ep-setting-block-title 内边距
    Row(style='padding-top: 8px;')
      Col(span='8' offset='2')
        FormItem(label='上' :label-width='20')
          Input( size='small' v-model='styles["padding-top"]')
        FormItem(label='下' :label-width='20')
          Input( size='small' v-model='styles["padding-bottom"]')
      Col(span='8' offset='2')
        FormItem(label='左' :label-width='20')
          Input( size='small' v-model='styles["padding-left"]')
        FormItem(label='右' :label-width='20')
          Input( size='small' v-model='styles["padding-right"]')

  .ep-setting-block
    h5.ep-setting-block-title 背景
    Row(style='padding-top: 8px;')
      Col(span='10')
        FormItem(label='背景色' :label-width='50')
          ColorPicker(v-model='styles["background-color"]' size='small' :alpha='true')
      Col(span='14')
        FormItem(label='RGB' :label-width='30')
          Input(v-model='styles["background-color"]' size='small')
      Col(span='24')
        FormItem(label='背景图' :label-width='50')
          Input(v-model='styles["background-image"]' placeholder='示例: url(http://test.com/abc.jpg)' size='small')
        FormItem(label='重复' :label-width='50')
          RadioGroup(v-model='styles["background-repeat"]')
            Radio(label='repeat') 重复
            Radio(label='no-repeat') 不重复
            Radio(label='repeat-x') 水平重复
            Radio(label='repeat-y') 垂直重复
        FormItem(label='尺寸' :label-width='50')
          RadioGroup(v-model='styles["background-size"]')
            Radio(label='cover') 覆盖
            Radio(label='contain') 适配
        FormItem(label='位置' :label-width='50')
          Input(v-model='styles["background-position"]' placeholder='示例: top left 或 10% 10%' size='small')
  slot
</template>
<script>
import { defaultStyle } from '../../util/style'

export default {
  props: {
    styles: {
      type: Object,
      default: () => defaultStyle()
    }
  },
  data () {
    return {
      style: {}
    }
  }
}
</script>
