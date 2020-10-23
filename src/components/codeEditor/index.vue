<template lang="pug">
.ep-codeeditor
  .ep-codeeditor-bar
    span.ep-codeeditor-summary
      b {{code.lines}}
      span &nbsp;lines
    slot(name='bar')
  pre.ep-codeeditor-content(v-if='code.lines > 1' v-html='code.content')
</template>
<script>

export default {
  props: {
    value: {
      default: ''
    },
    lang: {
      type: String,
      default: ''
    }
  },
  computed: {
    code () {
      return this.getCode()
    }
  },
  methods: {
    getCode () {
      let result = this.value
      switch (this.lang) {
        case 'json':
          result = this.getJSONString(this.value)
          break
        default:
          result = this.format(this.value)
          break
      }
      return result
    },
    getJSONString (value) {
      return this.format(value)
    },
    format (value) {
      const str = this.clean(value)
      return this.line(str)
    },
    clean (value) {
      return value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    },
    line (value) {
      // 总行数
      let lines = 1
      value = `<div class="line">${value}</div>`
      const content = value.replace(/\n/g, () => {
        lines++
        return '</div><div class="line">'
      })
      return { lines, content }
    }
  }
}
</script>
