<template lang="pug">
.ep-setting-block
  h5.ep-setting-block-title 数据源
  FormItem(v-if='Array.isArray(type)' label='数据类型')
    RadioGroup(
      v-model='selectedSchema.type'
      size='small'
      @on-change='onTypeChange'
    )
      Radio(
        v-for='item in type'
        :key='item.value'
        :label='item.value'
      )
        span {{item.label}}

  FormItem(label='数据来源')
    RadioGroup(
      v-model='schemaOption.type'
      size='small'
      @on-change='onOriginChange'
    )
      Radio(label='static')
        span 手动
      Radio(label='dynamic')
        span 接口

  template(v-if='schemaOption.type === "static"')
    template(v-if="hasItems && !$slots.tree")
      Row(v-for='(item, k) in schemaOption.data' :key='item.key + k')
        Col(span='8' offset='1' v-if="dataType === 'object'")
          FormItem(
            :label-width='1'
            :class="{'ivu-form-item-error': checkKeyType(item.key)}"
          )
            Input(
              type='text'
              size='small'
              placeholder='请输入key'
              :number='isNumberType(selectedSchema.type)'
              v-model='schemaOption.data[k].key'
            )
              //- @on-change='onKeyValueChange(k, "key", ...arguments)'

        Col(:span="dataType === 'object' ? 11 : 18" offset='1')
          FormItem(:label-width='1')
            Input(
              v-if='dataType === "object"'
              type='text'
              size='small'
              placeholder='请输入显示'
              v-model="schemaOption.data[k].value"
            )
            Input(
              v-else
              type='text'
              size='small'
              placeholder='请输入显示'
              v-model="schemaOption.data[k]"
            )
              //- @on-change='onKeyValueChange(k, "value", ...arguments)'

        Col(span='2' offset='1' style='line-height: 24px;')
          Icon(type='trash-a' title='删除' @click.native='onDeleteOption(k)')

      Row.ep-setting-option-add
        Button(type='dashed' size='small' @click='onAddOption') + 添加选项

    template(v-if = "$slots.tree")
      Row.ep-setting-option-add
        Button(type='dashed' size='small' @click="$emit('tree-data:append')") + 编辑选项

  template(v-else-if='schemaOption.type === "dynamic"')
    FormItem
      span(slot='label') 接口
        field-tip(:content='tips.url')
      Input(
        type='textarea'
        :rows='3'
        size='small'
        v-model='schemaOption.url'
        placeholder='http://'
        @on-change='onTextareaChange'
      )

    FormItem
      span(slot='label') 转换器
        field-tip(:content='tips.adapter')
      Input(
        type='textarea'
        size='small'
        :autosize='{minRows: 3, maxRows: 8}'
        v-model='schemaOption.adapter'
        @on-change='onTextareaChange'
      )
    slot(name="dynamic")
    FormItem
      Button(@click='onFetch' size='small') 测试
  slot(name="tree")
  slot
</template>
<script>
import { ajax, randomStr, isNumberString, include, isArray } from '../../../../modules/helper'
import EpWorker from '../../../../modules/worker'
import TypeBuilder from '../../../../modules/store/TypeBuilder'
import tips from './tips'
import FieldTip from '../field-tip'

const numberTypes = ['number', 'array<number>']

export default {
  components: {
    FieldTip

  },
  props: {
    store: {
      type: Object,
      default: () => ({
        types: {},
        state: {}
      })
    },
    dataType: {
      type: String,
      default: 'object'
    },
    workerAction: {
      type: String,
      default: 'fetch'
    }
  },
  data () {
    return {
      tips,
      worker: null
    }
  },
  computed: {
    type () {
      let type = ''
      const selectedSchema = this.store.getSelectedSchema()
      const flatWidgets = this.store.getFlatWidgets()
      const widget = flatWidgets[selectedSchema.widget]

      if (widget && widget.Schema) {
        type = widget.Schema.type
        if (isArray(type)) {
          const { multiple } = this.schemaOption
          // TODO:优化
          // 只保留基本类型  select、radio
          if (
            multiple in this.schemaOption ||
            type.find(item => !include(item, 'array'))
          ) {
            type = type.filter(k => !include(k, 'array'))
              .map(k => ({
                label: k,
                value: multiple ? `array<${k}>` : k
              }))
          } else { // cascader、checkbox
            type = type.filter(k => include(k, 'array'))
              .map(k => {
                const match = k.match(/array<([^<>]+)>/)
                if (match && match[1]) {
                  return {
                    label: match[1],
                    value: k
                  }
                }
              })
          }
        }
      }
      return type
    },

    selectedSchema () {
      return this.store.getSelectedSchema()
    },

    schemaOption: {
      get () {
        return this.selectedSchema.option
      },
      set (option) {
        const { key } = this.selectedSchema
        this.store.updateWidgetOption(key, option)
      }
    },

    hasItems () {
      const { option } = this.selectedSchema
      return option && option.data
    }
  },
  mounted () {
    this.worker = new EpWorker()
    this.listenerMessage()
  },
  methods: {
    isNumberType (type) {
      return numberTypes.indexOf(type) > -1
    },
    resolve (type) {
      // return Epage.TypeBuilder.resolve(type)
      return TypeBuilder.resolve(type)
    },

    listenerMessage () {
      this.worker.onmessage = e => {
        const { message, success, data } = e.data
        if (success) {
          this.$emit('success', data)
        } else {
          this.$emit('error', message)
        }
      }
    },
    // 校验其他类型是否能成功转 number 类型
    checkKeyType (key) {
      const schemaType = this.selectedSchema.type
      // schema.type 中可选的 number 类型
      return include(numberTypes, schemaType) && !isNumberString(key + '')
    },

    onTypeChange (type) {
      const { key } = this.selectedSchema
      this.store.updateWidgetType(key, type)
      this.selectedSchema.option.data.forEach(item => {
        const key = include(numberTypes, type) ? Number(item.key) : String(item.key)
        if (!isNaN(key)) {
          item.key = key
        }
        return item
      })
    },

    onOriginChange (type) {
      const { key } = this.selectedSchema
      this.store.updateWidgetOption(key, { type })
    },

    onAddOption () {
      const { key } = this.selectedSchema
      const data = [...this.schemaOption.data]
      const newKey = randomStr(7)
      let value = newKey
      // key - value
      if (this.dataType === 'object') {
        value = {
          key: newKey,
          value: newKey
        }
      }
      data.push(value)

      this.store.updateWidgetOption(key, { data })
      this.$emit('on-option-add')
    },
    onDeleteOption (index) {
      const { key } = this.selectedSchema
      const data = [...this.schemaOption.data]
      data.splice(index, 1)

      this.store.updateWidgetOption(key, { data })
      this.$emit('on-option-delete')
    },

    onTextareaChange (e) {
      this.$emit('on-adapter-change', e)
    },

    onFetch () {
      const { url, adapter } = this.schemaOption
      if (url) {
        ajax(url).then(res => {
          this.worker.postMessage({
            action: this.workerAction,
            data: res,
            fn: adapter
          })
        }).catch(err => {
          this.$emit('error', { success: false, message: err })
        })
      } else {
        console.warn('请输入接口地址')
      }
    },
    dataChange (data) {
      this.staticData = data
    }
  }
}
</script>
