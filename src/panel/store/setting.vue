<template lang="pug">
.ep-store-setting
  template(v-if='visible')
    Form(:label-width="100" :model='dict' :rules='rules' ref='setting')
      Row
        Col(span='12')
          FormItem(label='名称' prop='name')
            Input(
              type='text'
              v-model='dict.name'
              placeholder='英文、数字、下划线、中划线'
              :readonly='readonly'
            )

          FormItem(label='URL' prop='url')
            Input(
              type='textarea'
              v-model='dict.url'
              placeholder='请输入url'
              :readonly='readonly'
            )

          FormItem(label='描述' prop='desc')
            Input(
              type='textarea'
              v-model='dict.desc'
              placeholder='最多40个字符'
              :readonly='readonly'
            )

          FormItem(label='body' prop='body')
            Input(
              type='textarea'
              v-model='dict.body'
              placeholder='JSON格式'
              :readonly='readonly'
            )

        Col(span='12')
          FormItem(label='请求方法' prop='method')
            RadioGroup(v-model='dict.method' :disabled='readonly')
              Radio(
                v-for='method in methods'
                :key='method'
                :label='method'
              ) {{method}}

          FormItem(label='headers' prop='headers')
            Input(
              type='textarea'
              v-model='dict.headers'
              placeholder='请求头 JSON格式'
              :readonly='readonly'
            )

          FormItem(label='params' prop='params')
            Input(
              type='textarea'
              v-model='dict.params'
              placeholder='请求参数 JSON格式'
              :readonly='readonly'
            )

          FormItem(label='query' prop='query')
            Input(
              type='textarea'
              v-model='dict.query'
              placeholder='查询参数'
              :readonly='readonly'
            )

      FormItem(label='适配脚本' prop='adapter')
        Input(
          type='textarea'
          v-model='dict.adapter'
          placeholder='请求返回转换脚本，必须return'
          :readonly='readonly'
          :autosize='{ minRows: 6 }'
        )
      FormItem(v-if='!readonly')
        Button(type='primary' @click='onSave') 保 存
        Button(style='margin-left: 20px;' @click='onTest') 测 试
      FormItem.ep-store-setting-preview(label='格式预览')
        pre {{format}}

  .ep-store-setting-placeholder(v-else) 请选择字典列表或
    span.ep-store-setting-create(@click='onAddDict') 创建
    span 字典

</template>
<script>
import { Dict, helper } from 'epage-core'
import defaultDict from './defaultDict'

export default {
  props: {
    store: {
      type: Object,
      default: () => ({ state: {} })
    },
    config: {
      type: Object,
      default: () => defaultDict()
    }
  },
  data () {
    return {
      format: '',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      rules: {
        name: [{ required: true, message: '必填' }],
        url: [
          { required: true, message: '必填' }
        ],
        method: [{ required: true, message: '必填' }],
        headers: [{ required: false, validator: this.validateJSON }],
        body: [{ required: false }],
        params: [{ required: false, validator: this.validateJSON }],
        query: [{ required: false, validator: this.validateJSON }],
        adapter: [{ required: false }]
      }
    }
  },
  computed: {
    current () {
      return this.store.getStore().current
    },
    dict () {
      return this.current.dict
    },
    readonly () {
      return this.current.readonly
    },
    visible () {
      const { action } = this.current
      return action === 'create' || this.current.index > -1
    }
  },
  methods: {
    validateJSON (rule, value, callback) {
      if (!value) return callback()
      try {
        JSON.parse(value)
        callback()
      } catch (e) {
        callback(new Error('json error!'))
      }
    },
    parseForm () {
      const form = Object.assign({}, this.dict)
      form.headers = JSON.parse(form.headers || '{}')
      form.body = JSON.parse(form.body || '{}')
      form.params = JSON.parse(form.params || '{}')
      form.query = JSON.parse(form.query || '{}')
      return form
    },
    onSave () {
      this.$refs.setting.validate(valid => {
        if (valid) {
          const { action } = this.current
          if (action === 'create') {
            this.store.addDict(this.parseForm())
          } else {
            this.store.updateDict(this.parseForm(), this.current.index, 'update', 'static')
          }
          console.log('success:', this.dict)
        } else {
          console.log('error:', this.dict)
        }
      })
    },
    onTest () {
      this.$refs.setting.validate(valid => {
        if (valid) {
          const dict = new Dict(helper.jsonClone(this.parseForm()))

          dict.getData().then(res => {
            this.format = dict.format
          }).catch(err => {
            console.error('fetch error:', err)
          })
        } else {
          console.error('validate error:', this.dict)
        }
      })
    },
    onAddDict () {
      this.store.selectDict(defaultDict(), -1, 'create', 'static')
    }
  }
}
</script>
