<template lang="pug">
.ep-setting-block
  .ep-setting-block-title(
    v-if='title'
    style='margin-bottom: 6px;'
  ) {{title}}
  slot(name='before')
  Row
    Col(span='8' offset='8' style='margin-bottom: 8px;')
      Input(v-model='styles[`${prefix}top`]' size='small')
        span(slot='prepend') 上
    Col(span='8' offset='2' style='margin-bottom: 8px;')
      Input(v-model='styles[`${prefix}left`]' size='small')
        span(slot='prepend') 左
    Col(span='8' offset='2' style='margin-bottom: 8px;')
      Input(v-model='styles[`${prefix}right`]' size='small')
        span(slot='prepend') 右
    Col(span='8' offset='8' style='margin-bottom: 8px;')
      Input(v-model='styles[`${prefix}bottom`]' size='small')
        span(slot='prepend') 下
  slot(name='after')
  slot
</template>

<script>
const PREFIX_MAP = {
  margin: 'margin-',
  padding: 'padding-',
  position: ''
}

export default {
  props: {
    styles: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'margin'
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    prefix () {
      return PREFIX_MAP[this.type] || ''
    }
  }
}
</script>
