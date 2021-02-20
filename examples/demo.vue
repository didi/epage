<template lang="pug">
.demo-container
  //- .demo-header
  //-   span.demo-title Epage演示示例
  //-   span.demo-btns
  //-     Button.demo-btn(type='primary' size='small' @click='validateForm') 校验表单
  //-     Button.demo-btn(type='warning' size='small' @click='resetForm') 重置表单
  //-     Button.demo-btn(type='info' size='small' @click='getFormData') 获取表单值

  .demo-epage
    div(ref='form')

</template>
<script>
import Epage from '../src/main.js'
// import * as myRules from './rules'
// import schema from './schema.json'
// import styleSetting from './settings/style-etting'
import config from './epage.config.js'


const { render } = Epage

// 扩展自定义rule
// Rule.set(myRules)
// 自定义widget 的validators
// helper.setValidators(widgets, { input: ['phone'] })
// const myWidgets = helper.mergeWidget(widgets, richText)

export default {
  data () {
    return {
      epage: {},
      model: {
        kASJAJwRB: 'ss'
      }
    }
  },
  mounted () {
    const el = this.$refs.form
    const option = { ...config, el }
    // 设计器
    this.epage = new Epage(option)
    this.epage.$render.store.updateModel(this.model)
    // render
    // this.epage = new render.VueRender(option)
    // this.epage.store.updateModel(this.model)
  },
  methods: {
    checkPreview (action) {
      const text = {
        reset: '请在预览视图重置表单',
        validate: '请在预览视图校验表单',
        formdata: '请在预览视查看表单值'
      }
      const tab = this.epage.store.getTab()
      if (tab !== 'preview') {
        this.$Message.warning(text[action])
        return false
      }
      return true
    },
    validateForm (args) {
      if (!this.checkPreview('validate')) return
      this.epage.$render.validateFields().then(args => {
        console.log('validate: ', args)
      })
    },
    resetForm (args) {
      if (!this.checkPreview('reset')) return
      this.epage.$render.resetFields()
    },
    getFormData () {
      if (!this.checkPreview('formdata')) return
      const formData = this.epage.$render.store.getFormData()
      this.$Notice.open({
        title: '提醒',
        desc: '请打开开发者工具查看form data值',
        duration: 2
      })
      console.log('form data: ', formData)
    },
    listenerForm (form) {
      // 添加监听
      form
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
