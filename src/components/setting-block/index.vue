<template lang="pug">
.ep-setting-block
  h5.ep-setting-block-title(v-if='title') {{title}}
  .ep-setting-block-content
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
