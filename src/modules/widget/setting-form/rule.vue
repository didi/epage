<template lang="pug">
.ep-widget-rule
  template(v-if='rule.type === "string"')
    FormItem(label='最小长度')
      Input(type='text' size='small' placeholder='请输入最大长度' v-model='rule.min')
    FormItem(label='最大长度')
      Input(type='text' size='small' placeholder='请输入最大长度' v-model='rule.max')

  template(v-else-if='rule.type === "pattern"')
    FormItem(label='表达式')
      Input(type='text' size='small' placeholder='请添加规则' v-model='rule.pattern')
    FormItem(label='标记')
      Checkbox(v-model='rule.ignoreCase') 忽略大小写
      Checkbox(v-model='rule.global') 全局模式
      Checkbox(v-model='rule.multiline') 匹配多行

  template(v-else-if='rule.type === "number"')
    FormItem(label='最小')
      Input(type='text' size='small' placeholder='请输入最小值' v-model='rule.min')
    FormItem(label='最大')
      Input(type='text' size='small' placeholder='请输入最大值' v-model='rule.max')

  //- template(v-else-if='rule.type === "email"')
  //-   //- span email
  //- template(v-else-if='rule.type === "url"')
  //-   //- span url

  FormItem(label='错误提示' v-if='rule.type')
    Input(type='text' size='small' placeholder='错误提示信息' v-model='rule.message')
</template>
<script>

export default {
  props: {
    rule: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'rule.message' (message) {
      this.$emit('on-message-change', { index: this.index, message })
    }
  }
}
</script>
