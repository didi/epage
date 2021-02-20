<template lang="pug">
.demo-container
  .demo-header
    span.demo-title Epage演示示例
    span.demo-btns
      Button.demo-btn(type='primary' size='small' @click='validateForm') 校验表单
      Button.demo-btn(type='warning' size='small' @click='resetForm') 重置表单
      Button.demo-btn(type='info' size='small' @click='getFormData') 获取表单值

  .demo-epage
    div(ref='form')

</template>
<script>
import { Rule, helper, render } from 'epage-core'
import widgets from 'epage-iview'
import * as myRules from './rules'
import schema from './schema.json'

// 扩展自定义rule
Rule.set(myRules)
// 自定义widget 的validators
helper.setValidators(widgets, { input: ['phone'] })
// const myWidgets = helper.mergeWidget(widgets, richText)

export default {
  data () {
    return {
      render: {},
      model: {
        kAenMN1DX: '这是关键字'
      }
    }
  },
  mounted () {
    const el = this.$refs.form
    // 渲染默认编辑模式
    this.render = new render.VueRender({ el, widgets, schema })
    this.render.store.updateModel(this.model)
    this.listenerForm()
  },
  methods: {
    validateForm () {
      this.render.validateFields().then(args => {
        console.log('validate: ', args)
      })
    },
    resetForm () {
      this.render.resetFields()
    },
    getFormData () {
      const formData = this.render.store.getFormData()
      this.$Notice.open({
        title: '提醒',
        desc: '请打开开发者工具查看form data值',
        duration: 2
      })
      console.log('form data: ', formData)
    },
    listenerForm () {
      // 添加监听
      this.render
        .on('kAenMN1DX', 'change', e => {
          console.log(e.target.value, 9999)
        })
        // .off('k17U0aTQ4', 'change')
    }
  }
}
</script>
<style lang="less">
@import url('./demo.less');
</style>
