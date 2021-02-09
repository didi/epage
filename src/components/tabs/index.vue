<template lang="pug">
.ep-tabs
  .ep-tabs-nav
    .ep-tabs-nav-item(
      v-for='(item, index) in tabs'
      :key='item.key'
      :class='{"ep-tabs-nav-item-active": value === item.key }'
      @click='onClick(item.key, index)'
    ) {{item.name}}
  .ep-tabs-content-wrap
    .ep-tabs-content
      slot
</template>
<script>
export default {
  name: 'EpTabs',
  props: {
    value: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => [] // [{ key: 'k', name: 'k' }]
    }
  },
  data () {
    return {
      current: ''
    }
  },
  watch: {
    value (v) {
      this.setCurrent(v)
    }
  },
  methods: {
    onClick (key, index) {
      this.$emit('on-click', key, index)
    },
    setCurrent (value) {
      this.current = value
      this.$emit('input', value)
    }
  }
}
</script>
