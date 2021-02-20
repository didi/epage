<template lang="pug">
.style-setting
  Form(:label-width='60')
    FormItem(label='字段名')
      Input(size='small' v-model='selectedSchema.name')
</template>
<script>
export default {
  computed: {
    store () {
      return this.$root.$options.extension.store
    },
    $$store () {
      return this.$root.$options.extension.store.$$store
    },
    state () {
      return this.$$store.state
    },
    flatWidgets () {
      return this.store.getFlatWidgets()
    },
    flatSchemas () {
      return this.store.getFlatSchemas()
    },
    rootSchema () {
      return this.store.getRootSchema()
    },
    selectedSchema () {
      return this.store.getSelectedSchema()
    },
    rules () {
      return this.store.getFormRules()
    },
    model () {
      return this.store.getModel()
    }
  }
}
</script>
