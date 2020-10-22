<template lang="pug">
.ep-store
  .ep-store-dict
    .ep-store-dict-btns
      Button(type='primary' size='small' @click='onNewDict') + 添加字典

    .ep-store-dict-item(
      v-for='(item, index) in dicts'
      :key='item.name'
      :title='item.url'
    )
      .ep-store-dict-info(
        :class='getDictClass(index)'
        @click='onDictSelect(index)'
      )
        p.ep-store-dict-name 名称: {{item.name}}
        p.ep-store-dict-url URL: {{item.url}}
      .ep-store-dict-api(
        v-for='(sub, key) in item.data'
        :key='item.name + sub.name'
        :class='getAPIClass(key, index)'
        @click='onAPISelect(key, index)'
      )
        p.ep-store-dict-api-name {{sub.name}}
        p.ep-store-dict-api-url {{sub.url}}
        //- span.ep-store-dict-item-delete(@click='onAPIDelete(index)') 删除
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
        name: '',
        headers: '',
        body: '',
        query: '',
        params: ''
      },
      api: {
        name: '',
        headers: '',
        body: '',
        query: '',
        params: ''
      }
    }
  },
  computed: {
    current () {
      return this.store.getStore().current
    },
    dicts () {
      return this.store.getStore().dicts
    },
    apis () {
      return this.store.getStore().apis
    },
    config () {
      return this.current[this.current.type] || {}
    }
  },
  methods: {
    getDictClass (index) {
      const { type, dict } = this.current
      return {
        'ep-store-dict-active': type === 'dict' && dict.index === index
      }
    },
    getAPIClass (index, dictIndex) {
      const { type, api, dict } = this.current
      return {
        'ep-store-dict-api-active': type === 'api' && api.index === index && dict.index === dictIndex
      }
    },
    stringify (json) {
      return JSON.stringify(json, null, 2)
    },
    onDictSelect (index) {
      const { data, source, ...others } = this.dicts[index]
      const tmp = Object.assign(helper.jsonClone(others), { data: [], source: [] })
      const { headers, body, query, params } = tmp

      tmp.headers = this.stringify(headers)
      tmp.body = this.stringify(body)
      tmp.query = this.stringify(query)
      tmp.params = this.stringify(params)
      this.store.selectDict(tmp, index, 'update')
    },
    onAPISelect (index, dictIndex) {
      let api = this.apis[index]
      if (dictIndex > -1) {
        api = this.dicts[dictIndex].data[index]
      }
      const { data, source, ...others } = api
      const tmp = Object.assign(helper.jsonClone(others), { data: [], source: [] })
      const { headers, body, query, params } = tmp

      tmp.headers = this.stringify(headers)
      tmp.body = this.stringify(body)
      tmp.query = this.stringify(query)
      tmp.params = this.stringify(params)
      this.store.selectAPI(tmp, index, dictIndex)
    },
    onNewDict () {
      this.store.selectDict(defaultDict(), -1)
    },
    onNewAPI () {
      this.store.selectAPI(defaultDict(), -1, -1)
    },
    onAPIDelete (index) {
      this.store.deleteDict(index)
    }
  }
}
</script>
