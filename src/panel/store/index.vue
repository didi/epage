<template lang="pug">
.ep-store
  .ep-store-dicts
    .ep-store-dicts-btns
      Button(type='primary' size='small') + 添加字典
    .ep-store-dicts-item(
      v-for='item in dict.list'
      :key='item.name'
      :class='{"ep-store-dicts-item-active": dict.active === item.name}'
      :title='item.url'
      @click='dict.active = item.name'
    ) {{item.title}}
</template>
<script>

export default {
  data () {
    return {
      dict: {
        active: '',
        list: [
          {
            name: 'userlist',
            title: '用户接口',
            url: 'http://www.test.com/user/list'
          },
          {
            name: 'userlist2',
            title: '用户接口23',
            url: 'http://www.test.com/user/list'
          }
        ]
      }
    }
  },
  methods: {
    onDictSelect (dict) {
      console.log(dict)
    }
  }
}
</script>
