<template lang="pug">
.ep-setting-move-btn
  i.ep-icon.ep-icon-up-o(
    title='上移'
    @click='onMoveUp(index)'
    :class='{"ep-setting-move-btn-disabled": index === 0 }'
  )
  i.ep-icon.ep-icon-down-o(
    title='下移'
    @click='onMoveDown(index)'
    :class='{"ep-setting-move-btn-disabled": index === list.length - 1 }'
  )
  i.ep-icon.ep-icon-minus-o(
    title='删除'
    @click='onDelete(index)'
    :class='{"ep-setting-move-btn-disabled": list.length === 1 }'
  )
  i.ep-icon.ep-icon-plus-o(
    title='添加'
    @click='onAdd(index)'
  )
</template>
<script>

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
    return {}
  },
  methods: {
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
