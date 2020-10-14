<template lang="pug">
.ep-store-setting
  Form(:label-width="100" :rules='rules')
    Row
      Col(span='12')
        FormItem(label='名称' prop='name')
          Input(type='text' v-model='dict.name')

        FormItem(label='描述' prop='desc')
          Input(type='text' v-model='dict.desc')

        FormItem(label='URL' prop='url')
          Input(type='textarea' v-model='dict.url')

        FormItem(label='body' prop='body')
          Input(type='textarea' v-model='dict.body')

        FormItem(label='query' prop='query')
          Input(type='textarea' v-model='dict.query')
      Col(span='12')
        FormItem(label='请求方法' prop='method')
          RadioGroup(v-model='dict.method')
            Radio(
              v-for='method in methods'
              :key='method'
              :label='method'
            ) {{method}}

        FormItem(label='headers' prop='headers')
          Input(type='textarea' v-model='dict.headers')

        FormItem(label='params' prop='params')
          Input(type='textarea' v-model='dict.params')

        FormItem(label='适配脚本' prop='adapter')
          Input(type='textarea' v-model='dict.adapter')
    FormItem
      Button(size='small' type='primary') 保存

</template>
<script>

export default {
  data () {
    return {
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      rules: {
        name: [{ required: true, message: '必填' }],
        url: [{ required: true, message: '必填' }],
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
  }
}
</script>
