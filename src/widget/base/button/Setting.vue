<template lang="pug">
setting-form(:store='store' :setting='setting')
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

  template(v-if='MAIN_VERSION >= IVIEW_V3')
    FormItem(v-if='!$slots.ghost' label='幽灵按钮')
      i-switch(v-model='selectedSchema.option.ghost')
        span(slot='open') 是
        span(slot='close') 否
    template(v-else)
      slot(name='ghost')

  FormItem(v-if='!$slots.type' label='类型')
    RadioGroup(v-model='selectedSchema.option.type' size='small')
      Radio(label='default') Default
      Radio(v-if='MAIN_VERSION < IVIEW_V3' label='ghost') Ghost
      Radio(label='dashed') Dashed
      Radio(label='primary') Primary
      Radio(label='text') Text
  template(v-else)
    slot(name='type')

  FormItem(v-if='!$slots.icon' label='图标')
    Input(size='small' placeholder='iview icon或自定义class(iview@3支持)' v-model='selectedSchema.option.icon')
  template(v-else)
    slot(name='icon')

  FormItem(v-if='!$slots.script' label='点击腳本')
    Input(
      size='small'
      :rows='6'
      :autosize='{ minRows: 6, maxRows: 12 }'
      type='textarea'
      placeholder='输入 console.log(ctx) 看有哪些方法可用'
      v-model='selectedSchema.option.script'
    )
  template(v-else)
    slot(name='script')

  slot
  //- Modal(
  //-   v-model='editor.visible'
  //-   title='编辑脚本'
  //- )
  //-   div(slot='footer')
  //-     Button(type="primary" size="large" :loading="editor.loading" @click="onEditorOK") 确定
  //-   CodeEditor(v-model='selectedSchema.option.script')
</template>
<script>
import settingExtend from '../../extends/setting'
import {
  IVIEW_V3,
  MAIN_VERSION
} from '../../../util/iview-patch'

export default {
  extends: settingExtend,
  data () {
    return {
      MAIN_VERSION,
      IVIEW_V3,
      // editor: {
      //   visible: false,
      //   loading: false
      // }
    }
  },
  methods: {
    // onEditorShow () {
    //   this.editor.visible = true
    // },
    // onEditorOK () {
    //   console.log(2, this.selectedSchema.option.script)
    //   // this.editor.visible = false
    // }
  }
}
</script>
