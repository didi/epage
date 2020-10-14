<template lang="pug">
Collapse.ivu-collapse-simple(:value='widgets[0].key' simple)
  Panel(v-for='tool in widgets' :name='tool.key' :key='tool.key') {{tool.title}}
    template(slot='content')
      .ep-clearfix
        .ep-tool-item(
          v-for='widget in tool.widgets'
          :key='widget.Schema.widget'
          :animation='200'
          @click='addWidget(widget)'
        )
          .ep-tool-item-inner
            span {{widget.Schema.title}}
          .ep-tool-item-hover(v-if='widget.Schema.preview')
            img(:src='widget.Schema.preview')
</template>
<script>
import { helper } from 'epage-core'

const { isFunction } = helper

export default {
  props: {
    widgets: {
      type: Array,
      default: () => ([])
    },
    add: {
      type: Function,
      default: () => () => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    addWidget (widget) {
      if (!widget) return
      if (!isFunction(widget.Schema)) return

      this.$emit('on-add', widget.Schema.widget)
    }
  }
}
</script>
