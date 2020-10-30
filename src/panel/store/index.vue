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
        ep-store-more
          ep-store-more-item(@click.native='onDictToggle(index, $event)') 收展
          ep-store-more-item(@click.native='onDictDelete(index, $event)') 删除
          ep-store-more-item(@click.native='onDictCopy(index, $event)') 复制

        p.ep-store-dict-name {{item.method}} {{item.name}}
        p.ep-store-dict-url {{item.url}}
      .ep-store-dict-api(
        v-for='(sub, key) in item.data'
        :key='item.name + sub.name'
        :class='getAPIClass(key, index)'
        @click='onAPISelect(key, index)'
      )
        //- ep-store-more
        //-   ep-store-more-item(@click.native='onAPIDelete(key, index, $event)') 删除
        //-   ep-store-more-item(@click.native='onAPICopy(key, index, $event)') 复制

        p.ep-store-dict-api-name {{sub.method}} {{sub.name}}
        p.ep-store-dict-api-url {{sub.url}}
</template>
<script>
import { helper } from 'epage-core'
import defaultDict from './defaultDict'
import EpStoreMore from './components/more'
import EpStoreMoreItem from './components/more-item'

export default {
  components: {
    EpStoreMore,
    EpStoreMoreItem
  },
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
        header: [],
        body: '',
        query: [],
        params: []
      },
      api: {
        name: '',
        header: [],
        body: '',
        query: [],
        params: []
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
    onDictToggle (index, e) {
      e.stopPropagation()
    },
    onDictDelete (index, e) {
      e.stopPropagation()
      this.store.deleteDict(index)
    },
    onDictCopy (index, e) {
      e.stopPropagation()
      this.store.copyDict(index)
    },
    onAPIDelete (index, dictIndex, e) {
      e.stopPropagation()
      this.store.deleteAPI(index, dictIndex)
    },
    onAPICopy (index, dictIndex, e) {
      e.stopPropagation()
      this.store.deleteAPI(index, dictIndex)
    },
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
    onDictSelect (index) {
      const { data, source, ...others } = this.dicts[index]
      const tmp = Object.assign(helper.jsonClone(others), { data: [], source: [] })
      const { header, body, query, params } = tmp

      tmp.header = helper.jsonClone(header)
      tmp.body = body
      tmp.query = helper.jsonClone(query)
      tmp.params = helper.jsonClone(params)
      this.store.selectDict(tmp, index, 'update')
    },
    onAPISelect (index, dictIndex) {
      let api = this.apis[index]
      if (dictIndex > -1) {
        api = this.dicts[dictIndex].data[index]
      }
      const { data, source, ...others } = api
      const tmp = Object.assign(helper.jsonClone(others), { data: [], source: [] })
      const { header, body, query, params } = tmp

      tmp.header = header || []
      tmp.body = body
      tmp.query = query || []
      tmp.params = params || []
      this.store.selectAPI(tmp, index, dictIndex)
    },
    onNewDict () {
      this.store.selectDict(defaultDict(), -1)
    },
    onNewAPI () {
      this.store.selectAPI(defaultDict(), -1, -1)
    }
  }
}
</script>
