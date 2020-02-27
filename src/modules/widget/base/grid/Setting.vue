<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot='required')
  span(slot='disabled')
  span(slot='rule')
  span(slot='placeholder')
  span(slot='description')
  //- span(slot='title')
  span(slot='help')

  //- template(v-if='!selectedSchema.dynamic')
  //-   FormItem(v-if='!$slots.group' label='成组')
  //-     i-switch(v-model='selectedSchema.group')
  //-       span(slot='open') 是
  //-       span(slot='close') 否
  //-   template(v-else)
  //-     slot(name='group')

  FormItem(v-if='!$slots.gutter' label='栅格间距')
    InputNumber(
      v-model='selectedSchema.option.gutter'
      size='small'
      :step='1'
      :min='0'
    )
  template(v-else)
    slot(name='gutter')

  FormItem(v-if='!$slots.justify' label='水平对齐')
    Select(v-model='selectedSchema.option.justify' size='small')
      Option(value='start') 左对齐
      Option(value='end') 右对齐
      Option(value='center') 居中对齐
      Option(value='space-around') 分散对齐
      Option(value='space-between') 两端对齐
  template(v-else)
    slot(name='justify')

  FormItem(v-if='!$slots.align' label='垂直对齐')
    Select(v-model='selectedSchema.option.align')
      Option(value='top') 顶对齐
      Option(value='middle') 居中对齐
      Option(value='bottom') 底部对齐
  template(v-else)
    slot(name='align')

  FormItem(v-if='!$slots.children' label='列')
    Row(v-for='(item, k) in selectedSchema.children' :key='k')
      Col(span='8')
        InputNumber(
          v-model='selectedSchema.children[k].span'
          size='small'
          :step='1'
          :max='24'
          :min='1'
        )
      Col(span='12' offset='1').ep-setting-move-btn
        move-btn(
          :list='selectedSchema.children'
          :index='k'
          @on-move-up='onMoveUp'
          @on-move-down='onMoveDown'
          @on-delete='onRemove'
          @on-add='onAdd'
        )
  template(v-else)
    slot(name='children')

  template(v-if='!$slots.style')
    template(v-if='selectedSchema.style')
      FormItem(label='边框')
        Input(size='small' v-model='selectedSchema.style.border')
      FormItem(label='内边距')
        Input(size='small' v-model='selectedSchema.style.padding')
      FormItem(label='外边距')
        Input(size='small' v-model='selectedSchema.style.margin')
      FormItem(label='圆角')
        Input(size='small' v-model='selectedSchema.style["border-radius"]')

  template(v-else)
    slot(name='style')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'
import MoveBtn from '../../components/move-btn'

export default {
  components: {
    MoveBtn
  },
  extends: settingExtend,
  methods: {
    onMoveUp (index) {
      const key = this.selectedSchema.key
      this.store.moveWidgetChild(key, index - 1, index)
    },
    onMoveDown (index) {
      const key = this.selectedSchema.key
      this.store.moveWidgetChild(key, index, index + 1)
    },
    onRemove (index) {
      const key = this.selectedSchema.key
      this.store.removeWidgetChild(key, index)
    },
    onAdd (index) {
      const key = this.selectedSchema.key
      this.store.addWidgetChild(key, index, { span: 12, list: [] })
    }
  }
}
</script>
