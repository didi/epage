<template lang="pug">
.ep-store-setting
  Form(:label-width="100" :model='dict' :rules='rules' ref='setting')
    Row
      Col(span='12')
        FormItem(label='名称' prop='name')
          Input(
            type='text'
            v-model='dict.name'
            placeholder='英文、数字、下划线、中划线'
          )

        FormItem(label='URL' prop='url')
          Input(
            type='textarea'
            v-model='dict.url'
            placeholder='请输入url'
          )

        FormItem(label='描述' prop='desc')
          Input(
            type='text'
            v-model='dict.desc'
            placeholder='最多40个字符'
          )

        FormItem(label='body' prop='body')
          Input(
            type='textarea'
            v-model='dict.body'
            placeholder='JSON格式'
          )

        FormItem(label='query' prop='query')
          Input(
            type='textarea'
            v-model='dict.query'
            placeholder='查询参数'
          )
      Col(span='12')
        FormItem(label='请求方法' prop='method')
          RadioGroup(v-model='dict.method')
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
          )

        FormItem(label='params' prop='params')
          Input(
            type='textarea'
            v-model='dict.params'
            placeholder='请求参数 JSON格式'
          )

        FormItem(label='适配脚本' prop='adapter')
          Input(
            type='textarea'
            v-model='dict.adapter'
            placeholder='请求返回转换脚本，必须return'
          )
    FormItem
      Button(type='primary' @click='onSave') 保 存

</template>
<script>

export default {
  data () {
    return {
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      rules: {
        name: [{ required: true, message: '必填' }],
        url: [
          { required: true, message: '必填' },
          { type: 'url', message: '不符合URL规则' }
        ],
        method: [{ required: true, message: '必填' }],
        headers: [{ required: false }],
        body: [{ required: false }],
        params: [{ required: false }],
        query: [{ required: false }],
        adapter: [{ required: false }]
      },
      dict: {
        name: '',
        url: '',
        method: '',
        headers: '',
        body: '',
        params: '',
        query: '',
        adapter: ''
      }
    }
  },
  methods: {
    onSave () {
      console.log(11, this.dict)
      this.$refs.setting.validate(valid => {
        if (valid) {
          console.log('success:', this.dict)
        } else {
          console.log('error:', this.dict)
        }
      })
    }
  }
}
</script>
