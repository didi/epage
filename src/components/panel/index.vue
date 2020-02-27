<template lang="pug">
.ep-panel
  template(v-if='title')
    h3.ep-panel-title {{title}}
    .ep-panel-content
      slot
  template(v-else)
    slot
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
