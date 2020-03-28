<template lang="pug">
.ep-schema
  .ep-schema-bar
    span.ep-schema-summary
      b {{code.lines}}
      span &nbsp;lines
    .ep-schema-btns
      Button(size='small' icon='code-download' title='点击导入' @click.native='onImportShow' style='margin-right: 10px;') 导入
      Button(size='small' icon='ios-copy' title='点击复制' @click.native='onCopy') 复制

  Modal(title='导入schema' :width='600' :transfer='true' v-model='importModal.visible' @on-visible-change='onModalChange')
    Input(
      v-model='importModal.schema'
      type='textarea'
      :class='{"ivu-form-item-error": importModal.error}'
      :rows='10'
      placeholder='请输入schema数据，例如：\n{\n"widget": "grid",\n"children": [],\n...\n}'
    )
    .ivu-form-item-error-tip(v-if='importModal.error' style='position: static;') schema格式解析错误
    template(slot='footer')
      Button(size='small' @click='onImportHide') 取消
      Button(size='small' type='primary' @click='onImport') 导入

  pre.ep-schema-content(v-html='code.content')
</template>
<script>

import { Message } from 'iview'

export default {
  props: {
    store: {
      type: Object,
      default () {
        return { state: {} }
      }
    },
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      importModal: {
        visible: false,
        error: false,
        schema: ''
      }
    }
  },
  computed: {
    code () {
      let str = JSON.stringify(this.value, null, 2)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      // 总行数
      let lines = 1
      str = `<div class="line">${str}</div>`
      const content = str.replace(/\n/g, () => {
        lines++
        return '</div><div class="line">'
      })
      return { lines, content }
    }
  },
  methods: {
    onImportShow () {
      this.importModal.visible = true
    },
    onImportHide () {
      this.importModal.visible = false
    },
    onImport () {
      let schema = ''
      try {
        schema = JSON.parse(this.importModal.schema)
        this.store.initRootSchema(schema)
        this.store.deselectWidget()
        Message.success({ content: '导入成功', duration: 2 })
        this.onImportHide()
      } catch (e) {
        this.importModal.error = true
      }
    },
    onModalChange (visible) {
      this.importModal.schema = ''
      this.importModal.error = false
    },
    onCopy () {
      const input = document.createElement('textArea')
      input.setAttribute('style', 'display: block;height: 0;width: 0;')
      document.body.appendChild(input)
      input.value = JSON.stringify(this.value, null, 2)
      input.select()
      const isCopied = document.execCommand('copy', 'false', null)

      if (isCopied) {
        Message.success({ content: '复制成功', duration: 2 })
      } else {
        Message.success({ content: '复制失败', duration: 2 })
      }
      document.body.removeChild(input)
    }
  }
}
</script>
