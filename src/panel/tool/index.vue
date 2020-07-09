<template lang="pug">
Collapse.ivu-collapse-simple(:value='widgets[0].key' simple)
  Panel(v-for='tool in widgets' :name='tool.key' :key='tool.key') {{tool.title}}
    template(slot='content')
      .ep-tool-item(
        v-for='widget in tool.widgets'
        :key='widget.Schema.widget'
        :title='"点击添加 " + widget.Schema.title'
        :animation='200'
        @click='addWidget(widget)'
      )
        .ep-tool-item-inner
          template(v-if='getIcon(widget).icon')
            template(v-if='MAIN_VERSION === IVIEW_V2')
              i(v-if='getIcon(widget).isClass' :class='getIcon(widget).cls')
              Icon(v-else :type='getIcon(widget).icon')

            template(v-else-if='MAIN_VERSION >= IVIEW_V3')
              Icon(v-if='getIcon(widget).isClass' :custom='getIcon(widget).cls')
              Icon(v-else :type='getIcon(widget).icon')
          span {{widget.Schema.title}}
</template>
<script>
import { helper } from 'epage-core'
import {
  icon2to3,
  IVIEW_V2,
  IVIEW_V3,
  MAIN_VERSION
} from '../../util/iview-patch'

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
    return {
      IVIEW_V2,
      IVIEW_V3,
      MAIN_VERSION
    }
  },
  methods: {
    addWidget (widget) {
      if (!widget) return
      if (!isFunction(widget.Schema)) return

      this.$emit('on-add', widget.Schema.widget)
    },
    getClassName (clsses) {
      return clsses
        .split(/\s+/g)
        .map(i => i.split('.')[1])
        .filter(_ => _)
        .join(' ')
    },
    getIcon (widget) {
      const { icon } = widget.Schema
      // 支持class选择器
      let isClass = false
      let cls = ''
      let _icon = icon.trim()

      if (typeof _icon === 'string' && _icon) {
        isClass = _icon.indexOf('.') > -1
        if (isClass) {
          cls = this.getClassName(_icon)
        } else {
          // 兼容iview@3+ 新icon方案
          if (this.MAIN_VERSION >= IVIEW_V3 && _icon in icon2to3) {
            _icon = icon2to3[_icon]
          }
        }
      }
      return { isClass, cls, icon: _icon }
    }
  }
}
</script>
