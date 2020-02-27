<template lang="pug">
pre.ep-json(v-html='content')
</template>
<script>

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    content () {
      let str = JSON.stringify(this.value, null, 2)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

      str = `<div class="line">${str}</div>`
      return str
        .replace(/\n/g, '</div><div class="line">')
    }
  }
}
</script>
