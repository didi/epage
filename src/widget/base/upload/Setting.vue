<template lang="pug">
setting-form(:store='store')
  span(slot='disabled')

  FormItem(v-if='!$slots.action' label='上传地址')
    Input(size='small' v-model='schemaOption.action' type='textarea' placeholder='http://...或https://...')
  template(v-else)
    slot(name='action')

  FormItem(v-if='!$slots.adapter')
    span(slot='label') 匹配数据
      field-tip(:content="adapterContnet")
    Input(
      :rows='4'
      :autosize='{ minRows: 4, maxRows: 12 }'
      size='small'
      v-model='schemaOption.adapter'
      type='textarea'
      placeholder='return { name: data.name, url: data.url }'
    )
  template(v-else)
    slot(name='adapter')

  FormItem(v-if='!$slots.multiple' label='是否多选')
    i-switch(v-model='schemaOption.multiple')
      span(slot='open') 是
      span(slot='close') 否
  template(v-else)
    slot(name='multiple')

  FormItem(v-if='!$slots.withCredentials')
    span(slot='label') 传cookie
      field-tip(content='是否在CORS跨域情况下携带cookie')
    i-switch(v-model='schemaOption.withCredentials')
      span(slot='open') 是
      span(slot='close') 否
      span(slot='close') 否
  template(v-else)
    slot(name='withCredentials')

  FormItem(v-if='!$slots.showUploadList' label='显示列表')
    i-switch(v-model='schemaOption.showUploadList')
      span(slot='open') 是
      span(slot='close') 否
      span(slot='close') 否
  template(v-else)
    slot(name='showUploadList')

  FormItem(v-if='!$slots.maxSize' label='最大尺寸')
    Row
      Col(span='9')
        InputNumber(v-model='schemaOption.maxSize' size='small')
      Col(span='12' :offset='2')
        span kb
  template(v-else)
    slot(name='maxSize')

  FormItem(v-if='!$slots.data' label='额外参数' :class="{'ivu-form-item-error': extDataError}")
    span(slot='label') 额外参数
      field-tip(content='必须为 JSON')
    Input(v-model='extData' size='small' type='textarea')
    .ivu-form-item-error-tip(v-show="extDataError" style="position: static;") 必须为 JSON
  template(v-else)
    slot(name='data')

  FormItem(v-if='!$slots.type' label='上传类型')
    RadioGroup(v-model='schemaOption.type')
      Radio(label='select') 点击选择
      Radio(label='drag') 拖拽
  template(v-else)
    slot(name='type')

  .ep-setting-block(v-if='!$slots.format')
    h5.ep-setting-block-title 格式
    .ep-setting-block-btns
      Button(size='small' type='ghost' style='margin-right: 4px;' @click='onSelectAll') 全选
      Button(size='small' type='ghost' @click='onInverseSelect') 反选

    CheckboxGroup(size='small' v-model='schemaOption.format')
      Checkbox(
        v-for='ext in extensions'
        :key='ext'
        :label='ext'
        style='width: 56px;'
      ) {{ext}}
      Input(
        v-if='formatAdding'
        size='small'
        v-model='newFormat'
        ref='newFormat'
        @on-enter='onFormatAddEnter'
        style='width: 53px;')
      Button(v-else size='small' icon='plus' type='dashed' @click='onFormatAdd')
  template(v-else)
    slot(name='format')

  .ep-setting-block(v-if='!$slots.headers')
    h5.ep-setting-block-title 请求头
    Row(
      v-for='(item, k) in schemaOption.headers'
      :key='item.key + k'
      style='margin-top: 6px;'
    )
      Col(span='8' offset='1')
        Input(type='text' size='small' placeholder='请输入key' v-model='schemaOption.headers[k].key')

      Col(span='11' offset='1')
        Input(type='text' size='small' placeholder='请输入value' v-model='schemaOption.headers[k].value')

      Col(span='2' offset='1' style='line-height: 24px;')
        Icon(type='trash-a' title='删除' @click.native='onHeaderDelete(k)')

    Row.ep-setting-option-add
      Button(type='dashed' size='small' @click='onHeaderAdd') + 添加
  template(v-else)
    slot(name='headers')

  slot
</template>
<script>
import { helper } from 'epage-core'
import settingExtend from '../../extends/setting'
import { extensions } from './constant'
import FieldTip from '../../components/field-tip'

const { include } = helper

export default {
  components: {
    FieldTip
  },
  extends: settingExtend,
  data () {
    return {
      extensions,
      formatAdding: false,
      newFormat: '',
      extData: '{}',
      extDataError: false,
      adapterContnet: 'return格式必须为:{name, url}\ndata 为接口返回值，示例：\nreturn {\n  name: data.filename,\n  url: data.url\n}'
    }
  },
  computed: {
    schemaOption () {
      return this.selectedSchema.option || {}
    }
  },
  watch: {
    extData (v) {
      if (!v || !v.trim()) {
        this.extDataError = false
        return
      }
      const n = v.trim()
      if (!/^{.*}$/.test(n)) {
        this.extDataError = true
        return
      }

      const parsedJson = this.parseJson(n)
      if (parsedJson) {
        this.extDataError = false
        this.store.updateWidgetOption(this.selectedSchema.key, { data: parsedJson })
      } else {
        this.extDataError = true
      }
    }
  },
  methods: {
    parseJson (str) {
      let result = null
      try {
        result = JSON.parse(str)
      } catch (e) {
      }
      return result
    },

    onFormatAdd () {
      this.formatAdding = true
    },

    onFormatAddEnter (e) {
      e.preventDefault()
      const format = this.newFormat.trim()
      if (format && !include(this.extensions, format)) {
        this.extensions.push(this.newFormat)
      } else {
        this.formatAdding = false
      }
      this.newFormat = ''
    },

    onHeaderDelete (index) {
      const key = this.selectedSchema.key
      const option = { ...this.schemaOption }
      if (option.headers.length < 1) return
      option.headers.splice(index, 1)

      this.store.updateWidgetOption(key, option)
    },

    onHeaderAdd (index) {
      const key = this.selectedSchema.key
      const option = { ...this.schemaOption }
      const dataItem = { key: '', value: '' }
      if (!Array.isArray(option.headers)) option.headers = []
      option.headers.push(dataItem)

      this.store.updateWidgetOption(key, option)
    },

    onSelectAll () {
      const key = this.selectedSchema.key
      const option = { ...this.schemaOption }
      option.format = this.extensions

      this.store.updateWidgetOption(key, option)
    },

    onInverseSelect () {
      const key = this.selectedSchema.key
      const option = { ...this.schemaOption }
      const currentFormat = option.format
      const newFormat = [...this.extensions].filter(item => !include(currentFormat, item))
      option.format = newFormat

      this.store.updateWidgetOption(key, option)
    }
  }
}
</script>
