<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot='label')
  span(slot='description')
  span(slot='placeholder')
  span(slot='name')
  span(slot='rule')
  span(slot='help')
  span(slot='disabled')
  //- FormItem(v-if='!$slots.direction' label='方向')
  //-   RadioGroup(v-model='selectedSchema.option.direction' size='small' type='button' @on-change='onDirectionChange')
  //-     Radio(label='horizontal') 水平
  //-     Radio(label='vertical') 垂直
  //- template(v-else)
  //-   slot(name='direction')

  FormItem(v-if='!$slots.hposition' label='水平位置')
    RadioGroup(v-model='selectedSchema.option.hposition' size='small' type='button')
      Radio(label='top') 顶部
      Radio(label='middle') 中部
      Radio(label='bottom') 底部
  template(v-else)
    slot(name='hposition')

  FormItem(v-if='!$slots.vposition' label='垂直位置')
    RadioGroup(v-model='selectedSchema.option.vposition' size='small' type='button')
      Radio(label='left') 居左
      Radio(label='center') 居中
      Radio(label='right') 居右
  template(v-else)
    slot(name='vposition')

  FormItem(v-if='!$slots.length' label='长度(%)')
    InputNumber(v-model='selectedSchema.option.length' :min='0' :max='100' :step='1' size='small')
  template(v-else)
    slot(name='length')

  FormItem(v-if='!$slots.thickness' label='粗细')
    InputNumber(v-model='selectedSchema.option.thickness' :min='1' :max='1000' :step='1' size='small')
  template(v-else)
    slot(name='thickness')

  FormItem(v-if='!$slots.type' label='类型')
    Select(v-model='selectedSchema.option.type' size='small')
      Option(value='solid')
        span 实线
        span(:style='getBorder("solid")')
      Option(value='dashed')
        span 虚线
        span(:style='getBorder("dashed")')
      Option(value='dotted')
        span 点线
        span(:style='getBorder("dotted")')
  template(v-else)
    slot(name='type')

  FormItem(v-if='!$slots.color' label='颜色')
    ColorPicker(v-model='selectedSchema.option.color' size='small' :alpha='true')
  template(v-else)
    slot(name='color')

  slot

</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend,
  methods: {
    getBorder (type) {
      return `padding-left: 4px;position:relative;top: -3px;display:inline-block;width: 40px; height: 0px; border-top: 2px ${type} #333;`
    },
    onDirectionChange (dir) {
      const position = dir === 'horizontal' ? 'middle' : 'center'
      this.store.updateWidgetOption(this.selectedSchema.key, { position })
    }
  }
}
</script>
