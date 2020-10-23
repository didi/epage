<template lang="pug">
Form(
  :label-width="100"
  :model='configValue'
  :rules='rules'
  ref='setting'
)
  Row
    Col(span='12')
      FormItem(label='名称' prop='name')
        Input(
          type='text'
          v-model='configValue.name'
          placeholder='英文、数字、下划线、中划线'
          :disabled='!editable'
        )

      FormItem(label='URL' prop='url')
        Input(
          type='textarea'
          v-model='configValue.url'
          placeholder='请输入url'
          :disabled='!editable'
        )

      FormItem(label='描述' prop='desc')
        Input(
          type='textarea'
          v-model='configValue.desc'
          placeholder='最多40个字符'
          :disabled='!editable'
        )

      FormItem(label='body' prop='body')
        Input(
          type='textarea'
          v-model='configValue.body'
          placeholder='JSON格式'
          :disabled='!editable'
        )

    Col(span='12')
      FormItem(label='请求方法' prop='method')
        RadioGroup(v-model='configValue.method' :disabled='!editable')
          Radio(
            v-for='method in methods'
            :key='method'
            :label='method'
          ) {{method}}

      FormItem(label='headers' prop='headers')
        Input(
          type='textarea'
          v-model='configValue.headers'
          placeholder='请求头 JSON格式'
          :disabled='!editable'
        )

      FormItem(label='params' prop='params')
        Input(
          type='textarea'
          v-model='configValue.params'
          placeholder='请求参数 JSON格式'
          :disabled='!editable'
        )

      FormItem(label='query' prop='query')
        Input(
          type='textarea'
          v-model='configValue.query'
          placeholder='查询参数'
          :disabled='!editable'
        )

  FormItem(label='适配脚本' prop='adapter')
    Input(
      type='textarea'
      v-model='configValue.adapter'
      placeholder='请求返回转换脚本，必须return'
      :disabled='!editable'
      :autosize='{ minRows: 6 }'
    )
  FormItem
    Button(v-if='editable' style='margin-right: 20px;' type='primary' @click='onSave') 保 存
    Button(@click='onTest') 测 试
  FormItem(label='格式预览')
    ep-code-editor(:value='format')

</template>
<script>
import { API, helper } from 'epage-core'
import EpCodeEditor from '../../components/codeEditor'

export default {
  components: {
    EpCodeEditor
  },
  props: {
    store: {
      type: Object,
      default: () => ({ state: {} })
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
    configValue () {
      return (this.current[this.current.type] || {}).value || {}
    },
    editable () {
      const { type, dict } = this.current

      return !(type === 'api' && dict.index > -1)
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
      const form = Object.assign({}, this.configValue)
      form.headers = JSON.parse(form.headers || '{}')
      form.body = JSON.parse(form.body || '{}')
      form.params = JSON.parse(form.params || '{}')
      form.query = JSON.parse(form.query || '{}')
      return form
    },
    onSave () {
      this.$refs.setting.validate(valid => {
        if (valid) {
          const { type } = this.current
          const { action, index } = this.current[type] || {}
          const form = this.parseForm()

          if (action === 'create') {
            if (type === 'dict') {
              this.store.addDict(form)
            } else if (type === 'api') {
              this.store.addDict(form)
            }
          } else {
            if (type === 'dict') {
              this.store.updateDict(form, index)
            } else if (type === 'api') {
              this.store.updateAPI(form, index)
            }
          }
          console.log('success:', this.configValue)
        } else {
          console.log('error:', this.configValue)
        }
      })
    },
    onTest () {
      this.$refs.setting.validate(valid => {
        if (valid) {
          // const Construct = this.current.type === 'dict' ? Dict : API
          const ins = new API(helper.jsonClone(this.parseForm()))

          ins.getData().then(res => {
            this.format = ins.format
          }).catch(err => {
            console.error('fetch error:', err)
          })
        } else {
          console.error('validate error:', this.configValue)
        }
      })
    }
  }
}
</script>
