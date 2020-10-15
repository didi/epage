<template lang="pug">
.ep-store
  .ep-store-dicts
    .ep-store-dicts-btns
      Button(type='primary' size='small' @click='onNewDict') + 添加字典
    .ep-store-dicts-item(
      v-for='(item, index) in dicts'
      :key='item.name'
      :class='{"ep-store-dicts-item-active": dict.name === item.name}'
      :title='item.url'
      @click='onDictSelect(item, index)'
    ) {{item.name}}
      p {{item.url}}
      span.ep-store-dicts-item-delete(@click='onDictDelete(index)') 删除
</template>
<script>
import { helper } from 'epage-core'
import defaultDict from './defaultDict'

export default {
  props: {
    store: {
      type: Object,
      default: () => ({ state: {} })
    }
  },
  data () {
    return {
      dict: {
        name: ''
      }
    }
  },
  computed: {
    dicts () {
      return this.store.getStore().dicts
    }
  },
  methods: {
    stringify (json) {
      return JSON.stringify(json, null, 2)
    },
    onDictSelect (dict, index) {
      const { data, source, ...others } = dict
      const tmpDict = Object.assign(helper.jsonClone(others), { data: [], source: [] })
      const { headers, body, query, params } = tmpDict
      tmpDict.headers = this.stringify(headers)
      tmpDict.body = this.stringify(body)
      tmpDict.query = this.stringify(query)
      tmpDict.params = this.stringify(params)
      this.dict = tmpDict
      this.store.selectDict(tmpDict, index, 'update', 'static')
    },
    onNewDict () {
      this.store.selectDict(defaultDict(), -1, 'create', 'static')
    },
    onDictDelete (index) {
      this.store.deleteDict(index)
    }
  }
}
</script>
