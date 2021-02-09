<template lang="pug">
.ep-tabs-pane
  slot
</template>
<script>
export default {
  name: 'EpTabsPane',
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
