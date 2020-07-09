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
import {
  getIcon,
  IVIEW_V3,
  MAIN_VERSION
} from '../../../util/iview-patch'

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
      // 兼容iview@3+ 新icon方案
      if (MAIN_VERSION >= IVIEW_V3) {
        Object.assign(this.icon, getIcon(2, this.icon))
      }
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
