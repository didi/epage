<template lang="pug">
Tooltip(placement='top' :transfer='true')
  pre.ep-setting-tooltip(slot='content' v-html='content')
  Icon(type='ios-information-outline')
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>
