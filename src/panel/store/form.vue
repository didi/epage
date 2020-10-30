<template lang="pug">
Form(
  :model='configValue'
  :rules='rules'
  ref='setting'
)
  Row
    Col(span='24')
      FormItem(label='名称' prop='name' :label-width='60')
        Input(
          type='text'
          v-model='configValue.name'
          placeholder='英文、数字、下划线、中划线'
          :disabled='!editable'
        )
    Col(span='18')
      FormItem(prop='url' :label-width='0')
        Input(
          type='text'
          v-model='configValue.url'
          placeholder='英文、数字、下划线、中划线'
          :disabled='!editable'
        )
          Select(
            v-model='configValue.method'
            slot='prepend'
            style='width: 80px'
            :disabled='!editable'
          )
            Option(
              v-for='method in methods'
              :key='method'
              :value='method'
            ) {{method}}
    Col(span='6')
      Button(type='primary' v-if='editable' style='margin-right: 16px;' @click='onSave') 保存
      Button(@click='onTest') 测试

  Tabs(size='small' value='query')
    TabPane(label='Query' name='query')
      EpKeyValue(
        :list='configValue.query'
        @on-add='headerPropAdd("query", ...arguments)'
        @on-delete='headerPropDelete("query", ...arguments)'
      )

    TabPane(label='Header' name='header')
      EpKeyValue(
        :list='configValue.header'
        @on-add='headerPropAdd("header", ...arguments)'
        @on-delete='headerPropDelete("header", ...arguments)'
      )

    TabPane(label='Body' name='body')
      Input(
        type='textarea'
        v-model='configValue.body'
        placeholder='JSON格式'
        :disabled='!editable'
        :autosize='{ minRows: 6 }'
      )

    TabPane(label='Params' name='params')
      EpKeyValue(
        :list='configValue.params'
        @on-add='headerPropAdd("params", ...arguments)'
        @on-delete='headerPropDelete("params", ...arguments)'
      )

    TabPane(label='Script' name='script')
      Input(
        type='textarea'
        v-model='configValue.adapter'
        placeholder='请求返回转换脚本，必须return'
        :disabled='!editable'
        :autosize='{ minRows: 6 }'
      )

  h4 响应
  Tabs(size='small' value='format')
    TabPane(label='Format' name='format')
      ep-code-editor(v-show='format' :value='format')
    TabPane(label='Header')
      ep-code-editor(v-show='response.header' :value='response.header')

</template>
<script>
import { API, helper } from 'epage-core'
import EpCodeEditor from '../../components/codeEditor'
import EpKeyValue from './components/key-value'
import defaultDict from './defaultDict'

export default {
  components: {
    EpCodeEditor,
    EpKeyValue
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
      type: '', // api | dict
      dict: {
        index: -1,
        value: {}
      },
      api: {
        index: -1,
        value: {}
      },
      response: {
        header: ''
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      rules: {
        name: [{ required: true, message: '必填' }],
        url: [
          { required: true, message: '必填' }
        ],
        method: [{ required: true, message: '必填' }],
        header: [{ required: false, validator: this.validateJSON }],
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
      return (this[this.type] || {}).value || {}
    },
    editable () {
      const { type, dict } = this

      return !(type === 'api' && dict.index > -1)
    }
  },
  watch: {
    current: {
      handler (value) {
        const { type } = value
        if (type) {
          this.type = type
          this[type] = helper.jsonClone(value[type])
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    headerPropAdd (prop, index) {
      const value = this[this.type].value
      if (value) {
        value[prop].splice(index + 1, 0, defaultDict())
      }
    },
    headerPropDelete (prop, index) {
      const value = this[this.type].value
      if (value) {
        value[prop].splice(index, 1)
      }
    },
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
      form.header = helper.jsonClone(form.header || '[]')
      form.params = helper.jsonClone(form.params || '[]')
      form.query = helper.jsonClone(form.query || '[]')
      return form
    },
    onSave () {
      this.$refs.setting.validate(valid => {
        if (valid) {
          const { type } = this.current
          const { action, index } = this.current[type] || {}
          const form = this.parseForm()
          const methods = {
            dict: {
              create: ['addDict', [form]],
              update: ['updateDict', [form, index]]
            },
            api: {
              create: ['addAPI', [form]],
              update: ['updateAPI', [form, index]]
            }
          }

          if (!(type in methods)) return
          if (!(action in methods[type])) return

          const method = methods[type][action]

          this.store[method[0]](...method[1])

          console.log('success:', this.configValue)
        } else {
          console.log('error:', this.configValue)
        }
      })
    },
    onTest () {
      this.$refs.setting.validate(valid => {
        if (valid) {
          const ins = new API(helper.jsonClone(this.parseForm()))

          ins.getData().then(res => {
            this.format = ins.format
            this.response.header = JSON.stringify(this.array2object(ins.response.header), null, 2)
          }).catch(err => {
            this.format = ''
            this.response.header = ''
            console.error('fetch error:', err)
          })
        } else {
          console.error('validate error:', this.configValue)
        }
      })
    },
    array2object (array = []) {
      const result = {}
      array.forEach((item) => {
        result[item.key] = item.value
      })
      return result
    }
  }
}
</script>
