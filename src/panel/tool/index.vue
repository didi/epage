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
            template(v-if='mainVersion === 2')
              i(v-if='getIcon(widget).isClass' :class='getIcon(widget).cls')
              Icon(v-else :type='getIcon(widget).icon')

            template(v-else-if='mainVersion >= 3')
              Icon(v-if='getIcon(widget).isClass' :custom='getIcon(widget).cls')
              Icon(v-else :type='getIcon(widget).icon')
          span {{widget.Schema.title}}
//- Tabs(size='small')
//-   TabPane(
//-     v-for='tool in widgets'
//-     :key='tool.key'
//-     :label='tool.title'
//-     :name='tool.title'
//-   )
//-     epage-panel
//-       .ep-tool-item(
//-         v-for='widget in tool.widgets'
//-         :key='widget.Schema.widget'
//-         :title='widget.Schema.title'
//-         :animation='200'
//-         @click='addWidget(widget)'
//-       )
//-         .ep-tool-item-inner
//-           template(v-if='getIcon(widget).icon')
//-             template(v-if='mainVersion === 2')
//-               i(v-if='getIcon(widget).isClass' :class='getIcon(widget).cls')
//-               Icon(v-else :type='getIcon(widget).icon')

//-             template(v-else-if='mainVersion >= 3')
//-               Icon(v-if='getIcon(widget).isClass' :custom='getIcon(widget).cls')
//-               Icon(v-else :type='getIcon(widget).icon')
//-           span {{widget.Schema.title}}
</template>
<script>
import { version } from 'iview'
import { helper, constant } from 'epage-core'

const { map2to3, IVIEW_V3 } = constant
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
      mainVersion: parseInt(version || 2)
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
          if (this.mainVersion >= IVIEW_V3 && _icon in map2to3) {
            _icon = map2to3[_icon]
          }
        }
      }
      return { isClass, cls, icon: _icon }
    }
  }
}
</script>
