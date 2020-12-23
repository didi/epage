<template lang="pug">
.ep-style

  FormItem(label='宽度')
    Input( size='small' placeholder='示例: 1200px 或 90%' v-model='styles.width')

  ep-bounding(
    title='外边距'
    type='margin'
    :styles='styles'
  )
  ep-bounding(
    title='内边距'
    type='padding'
    :styles='styles'
  )

  .ep-setting-block
    h5.ep-setting-block-title 页面背景
    Row(style='padding-top: 8px;' )
      Col(span='10')
        FormItem(label='背景色' :label-width='50')
          ColorPicker(v-model='styles.container["background-color"]' size='small' :alpha='true')
      Col(span='14')
        FormItem(label='RGB' :label-width='50')
          Input(v-model='styles.container["background-color"]' size='small')

    .ep-style-background-item(v-for='(bg, index) in styles.container.background' :key='index')
      h4.ep-style-background-item-title
        span 背景-{{index + 1}}
        .ep-style-background-item-option
          Icon.ep-style-background-up(
            type='arrow-up-c'
            title='上移'
            :class='{ disabled: index === 0 }'
            @click.native='onBackgroundUp(index)'
          )
          Icon.ep-style-background-down(
            type='arrow-down-c'
            title='下移'
            @click.native='onBackgroundDown(index)'
          )
          Icon.ep-style-background-delete(
            type='close-round'
            title='删除'
            @click.native='onBackgroundDelete(index)'
          )

      Row(style='padding-top: 8px;' )
        Col(span='24')
          FormItem(label='图片' :label-width='50')
            Input(
              v-model='bg.image'
              type='textarea'
              :autosize='{ minRows: 4, maxRows: 8 }'
              placeholder='示例: http://test.com/abc.jpg'
              size='small'
            )
          FormItem(label='重复' size='small' :label-width='50')
            Select(v-model='bg.repeat')
              Option(value='no-repeat') 不重复
              Option(value='repeat') 水平垂直重复
              Option(value='repeat-x') 水平重复
              Option(value='repeat-y') 垂直重复

          FormItem(label='尺寸' :label-width='50')
            RadioGroup(v-model='bg.size')
              Radio(label='cover') 覆盖
              Radio(label='contain') 适配
          FormItem(label='位置' :label-width='50')
            RadioGroup(v-model='bg.position')
              Radio(label='top') 顶部居中
              Radio(label='bottom') 底部居中
    div(style='text-align: center;padding: 6px;')
      Button(size='small' @click='onAddPageBg') + 添加背景图
  slot
</template>
<script>
import { style } from 'epage-core'
import EpBounding from '../bounding'

export default {
  components: {
    EpBounding
  },
  props: {
    store: {
      type: Object,
      default: () => ({ state: {} })
    }
  },
  computed: {
    styles () {
      return this.store.getRootSchema().style
    }
  },
  methods: {
    onAddPageBg () {
      const bg = new style.Background()
      const _style = this.store.getRootSchema().style
      const container = { ..._style.container }
      container.background.push(bg)
      this.store.updateStyle({ container })
    }
  }
}
</script>
