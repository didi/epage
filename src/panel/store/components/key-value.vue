<template lang="pug">
div
  Row(
    :gutter='16'
    style='border-bottom: 1px solid #ddd;padding-bottom: 6px;margin-bottom: 6px;'
  )
    Col(span='6') key
    Col(span='6') value
    Col(span='6') 描述
    Col(span='6') 操作
  Row(
    v-for='(item, key) in list'
    :key='key'
    :gutter='16'
    style='margin-bottom: 6px;'
  )
    Col(span='6')
      Input(size='small' v-model='item.key')
    Col(span='6')
      Input(size='small' v-model='item.value')
    Col(span='6')
      Input(size='small' v-model='item.description')
    Col(span='6')
      Button(
        size='small'
        style='margin-right: 6px;'
         @click='onAdd(key)'
      ) 添加
      Button(
        size='small'
        :disabled='list.length <= 1'
        @click='onDelete(key)'
      ) 删除
  Row
    Col(span='24' style='text-align: center;')
      Button(
        @click='onAdd(list.length - 1)'
        style='width: 100px;'
      ) + 添加
</template>
<script>
export default {
  name: 'EpKeyValue',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onAdd (index) {
      this.$emit('on-add', index)
    },
    onDelete (index) {
      this.$emit('on-delete', index)
    }
  }
}
</script>
