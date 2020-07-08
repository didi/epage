<template lang="pug">
.ep-setting-move-btn
  Icon(
    title='上移'
    :type='icon.moveUp'
    @click.native='onMoveUp(index)'
    :class='{"ep-setting-move-btn-disabled": index === 0 }'
  )
  Icon(
    title='下移'
    :type='icon.moveDown'
    @click.native='onMoveDown(index)'
    :class='{"ep-setting-move-btn-disabled": index === list.length - 1 }'
  )
  Icon(
    title='删除'
    :type='icon.remove'
    @click.native='onDelete(index)'
    :class='{"ep-setting-move-btn-disabled": list.length === 1 }'
  )
  Icon(
    title='添加'
    :type='icon.add'
    @click.native='onAdd(index)'
  )
</template>
<script>
import { version } from 'iview'
import { map2to3 } from '../../../../modules/constant/icon-type-map'
import { IVIEW_V3 } from '../../../../modules/constant/static'

const mainVersion = parseInt(version || 2)
export default {
  props: {
    index: {
      type: Number,
      default: -1
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      icon: {
        moveUp: 'android-arrow-up',
        moveDown: 'android-arrow-down',
        remove: 'ios-minus-outline',
        add: 'ios-plus-outline'
      }
    }
  },
  beforeMount () {
    this.setIcon()
  },
  methods: {
    setIcon () {
      const { icon } = this
      const _icon = {}
      // 兼容iview@3+ 新icon方案
      if (mainVersion >= IVIEW_V3) {
        if (icon.moveUp in map2to3) _icon.moveUp = map2to3[icon.moveUp]
        if (icon.moveDown in map2to3) _icon.moveDown = map2to3[icon.moveDown]
        if (icon.remove in map2to3) _icon.remove = map2to3[icon.remove]
        if (icon.add in map2to3) _icon.add = map2to3[icon.add]
      }
      Object.assign(this.icon, _icon)
    },
    onMoveUp (index) {
      this.$emit('on-move-up', index)
    },
    onMoveDown (index) {
      this.$emit('on-move-down', index)
    },
    onDelete (index) {
      this.$emit('on-delete', index)
    },
    onAdd (index) {
      this.$emit('on-add', index)
    }
  }
}
</script>
