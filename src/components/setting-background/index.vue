<template lang="pug">
ep-setting-block(:title='title')
  Row(style='padding-top: 8px;' )
    Col(span='10')
      FormItem(label='背景色' :label-width='50')
        ColorPicker.ep-style-color-picker(
          v-model='schema.style.container["background-color"]'
          size='small'
          :alpha='true'
        )
    Col(span='14')
      FormItem(label='RGB' :label-width='50')
        Input(
          v-model='schema.style.container["background-color"]'
          size='small'
        )
  .ep-style-background-item(
    v-for='(bg, index) in schema.style.container.background'
    :key='index'
  )
    h4.ep-style-background-item-title
      span 背景-{{index + 1}}
      .ep-style-background-item-option
        i.ep-style-background-up.ep-icon.ep-icon-up(
          title='上移'
          :class='{ disabled: index === 0 }'
          @click='moveBackground(index - 1)'
        )
        i.ep-style-background-down.ep-icon.ep-icon-down(
          title='下移'
          :class='{ disabled: index + 1 === schema.style.container.background.length }'
          @click='moveBackground(index)'
        )
        i.ep-style-background-delete.ep-icon.ep-icon-close(
          title='删除'
          @click='deleteBackground(index)'
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
        FormItem(label='重复' :label-width='50')
          Select(v-model='bg.repeat' size='small')
            Option(value='no-repeat') 不重复
            Option(value='repeat') 水平垂直重复
            Option(value='repeat-x') 水平重复
            Option(value='repeat-y') 垂直重复

        FormItem(label='尺寸' :label-width='50')
          RadioGroup(
            :value='getBgSize(bg.size)'
            size='small'
            @on-change='onSizeChange(index, ...arguments)'
          )
            Radio(label='cover') 覆盖
            Radio(label='contain') 适配
            Radio(label='custom') 自定义
        FormItem(:label-width='50' v-if='getBgSize(bg.size) === "custom"')
          Input(
            v-model='bg.size'
            size='small'
            placeholder='如: 100% 100%'
          )
        FormItem.ep-style-background-position(label='位置' :label-width='50')
          RadioGroup(v-model="bg.position" type="button" size="large")
            Radio(
              v-for='item in BG_POSITIONS_1'
              :key='item.key'
              :label='item.key'
            ) {{item.value}}
          RadioGroup(v-model="bg.position" type="button" size="large")
            Radio(
              v-for='item in BG_POSITIONS_2'
              :key='item.key'
              :label='item.key'
            ) {{item.value}}
          RadioGroup(v-model="bg.position" type="button" size="large")
            Radio(
              v-for='item in BG_POSITIONS_3'
              :key='item.key'
              :label='item.key'
            ) {{item.value}}
          RadioGroup(
            :value="getBgPosition(bg.position)"
            type="button"
            size="small"
            style='width: 138px;'
            @on-change='onPositionChange(index, ...arguments)'
          )
            Radio(label='custom' style='width: 100%;') 自定义
        FormItem(:label-width='50' v-if='getBgPosition(bg.position) === "custom"')
          Input(size='small' v-model='bg.position' style='width: 138px;')
  div(style='text-align: center;padding: 6px;')
    Button(size='small' @click='addBackground') + 添加背景图
</template>
<script>
import { style } from 'epage-core'
import EpSettingBlock from '../setting-block'

export default {
  components: {
    EpSettingBlock
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    // 是否为根节点schema
    root: {
      type: Boolean,
      default: false
    },
    schema: {
      type: Object,
      default: () => ({
        style: {}
      })
    },
    store: {
      type: Object,
      default: () => ({ state: {} })
    }
  },
  data () {
    return {
      BG_SIZES: [
        { key: 'cover', value: '覆盖' },
        { key: 'contain', value: '适配' }
      ],
      BG_POSITIONS_1: [
        { key: 'top left', value: '↖' },
        { key: 'top center', value: '↑' },
        { key: 'top right', value: '↗' }
      ],
      BG_POSITIONS_2: [
        { key: 'center left', value: '←' },
        { key: 'center center', value: '·' },
        { key: 'center right', value: '→' }
      ],
      BG_POSITIONS_3: [
        { key: 'bottom left', value: '↙' },
        { key: 'bottom center', value: '↓' },
        { key: 'bottom right', value: '↘' }
      ]
    }
  },
  methods: {
    addBackground () {
      this.updateBackground(background => {
        const bg = new style.Background()
        background.push(bg)
        return background
      })
    },
    deleteBackground (index) {
      this.updateBackground(background => {
        background.splice(index, 1)
        return background
      })
    },
    moveBackground (index) {
      this.updateBackground(background => {
        const current = background[index]
        const nextBg = background[index + 1]
        background.splice(index, 1, nextBg)
        background.splice(index + 1, 1, current)
        return background
      })
    },
    updateBackground (fn) {
      const { key } = this.schema
      const schemaKey = this.root ? null : key
      const container = { ...this.schema.style.container }
      let background = [...container.background || []]
      background = fn(background)
      container.background = background
      this.store.updateStyle(schemaKey, { container })
    },
    onSizeChange (index, size) {
      this.updateBackground(background => {
        const current = background[index]
        current.size = this.BG_SIZES.filter(s => s.key === size).length
          ? size
          : '100% 100%'

        return background
      })
    },
    getBgSize (size) {
      return this.BG_SIZES.filter(s => s.key === size).length
        ? size
        : 'custom'
    },
    getBgPosition (position) {
      return this.includePosition(position) ? position : 'custom'
    },

    onPositionChange (index, position) {
      this.updateBackground(background => {
        const current = background[index]

        current.position = this.includePosition(position) ? position : ''
        return background
      })
    },
    includePosition (position) {
      const positions = [
        ...this.BG_POSITIONS_1,
        ...this.BG_POSITIONS_2,
        ...this.BG_POSITIONS_3
      ]
      return !!positions.filter(p => p.key === position).length
    }
  }
}
</script>
