<template lang="pug">
.ep-store-setting
  store-form(v-if='visible' :store='store')

  .ep-store-setting-placeholder(v-else) 请选择字典列表或
    span.ep-store-setting-create(@click='onAddDict') 创建
    span 字典

</template>
<script>
import StoreForm from './form'
import defaultDict from './defaultDict'

export default {
  components: {
    StoreForm
  },
  props: {
    store: {
      type: Object,
      default: () => ({ state: {} })
    }
  },
  computed: {
    current () {
      return this.store.getStore().current
    },
    visible () {
      const { type } = this.current
      const { index, action } = this.current[type] || {}
      return action === 'create' || index > -1
    }
  },

  methods: {
    onAddDict () {
      this.store.selectDict(defaultDict(), -1)
    }
  }
}
</script>
