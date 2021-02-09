<template lang="pug">
setting-form(:store='store')
  span(slot="rule")
    FormItem(v-if='!$slots.rule' label='必填')
      i-switch(v-model='selectedSchema.rules[0].required' @on-change="switchChange")
        span(slot='open') 是
        span(slot='close') 否

  span(slot="placeholder")

  FormItem(v-if='!$slots.defaultValue' label='默认值')
    InputNumber(
      size='small'
      :min='0'
      :max='selectedSchema.option.count'
      :step='selectedSchema.option.allowHalf ? 0.5 : 1'
      v-model='selectedSchema.default'
      placeholder='默认值'
    )
  template(v-else)
    slot(name='defaultValue')

  FormItem(v-if='!$slots.count' label='总数')
    InputNumber(
      v-model='selectedSchema.option.count'
      :min='2'
      :step='1'
      :transfer='true'
      size='small'
    )
  template(v-else)
    slot(name='count')

  FormItem(v-if='!$slots.allowHalf' label='是否半选')
    i-switch(v-model='selectedSchema.option.allowHalf')
      span(slot='open') 是
      span(slot='close') 否
  template(v-else)
    slot(name='allowHalf')

  FormItem(v-if='!$slots.showText' label='是否提示')
    i-switch(v-model='selectedSchema.option.showText')
      span(slot='open') 是
      span(slot='close') 否
  template(v-else)
    slot(name='showText')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'

export default {
  extends: settingExtend,
  methods: {
    // 当必填时候，评分至少 0.5，非必填情况下，评分可以为 0
    switchChange (required) {
      const min = required ? 0.5 : 0
      const rule = { required, min }

      this.store.updateRule(this.selectedSchema.key, 0, rule)
    }
  }
}
</script>
