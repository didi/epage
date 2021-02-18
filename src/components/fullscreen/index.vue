<template lang="pug">
.ep-fullscreen(v-show='visible')
  .ep-fullscreen-header(v-if='$slots.header')
    slot(name='header')
    span.ep-fullscreen-close.ep-icon.ep-icon-close(@click='onClose')
  .ep-fullscreen-body
    slot
</template>
<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close')
    }
  }
}
</script>
