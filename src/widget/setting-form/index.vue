<template lang="pug">
Form(:label-width='80')
  div(v-for='order in orders' :key='order.key')
    template(v-if='order.key === "key"')
      FormItem(v-if='!$slots.key' label='唯一标识')
        Input(
          type='text'
          size='small'
          placeholder='不能重复'
          :disabled='true'
          v-model='selectedSchema.key'
        )
      template(v-else)
        slot(name='key')

    template(v-if='order.key === "name"')
      template(v-if='setting.name !== false')
        FormItem(v-if='!$slots.name' label='字段名')
          Input(
            type='text'
            size='small'
            placeholder='不能重复'
            v-model='selectedSchema.name'
          )
        template(v-else)
          slot(name='name')

    template(v-if='order.key === "label"')
      template(v-if='setting.label !== false')
        FormItem(v-if='!$slots.label' label='标题')
          Input(
            type='text'
            size='small'
            placeholder='请输入标题'
            v-model='selectedSchema.label'
          )
        template(v-else)
          slot(name='label')

    template(v-if='order.key === "placeholder"')
      template(v-if='setting.placeholder !== false')
        FormItem(v-if='!$slots.placeholder' label='占位提示')
          Input(
            type='text'
            size='small'
            placeholder='请输入...'
            v-model='selectedSchema.placeholder'
          )
        template(v-else)
          slot(name='placeholder')

    template(v-if='order.key === "description"')
      template(v-if='setting.description !== false')
        FormItem(v-if='!$slots.description' label='组件说明')
          Input(
            type='textarea'
            size='small'
            placeholder='请输入组件说明'
            v-model='selectedSchema.description'
          )
        template(v-else)
          slot(name='description')

    template(v-if='order.key === "help"')
      template(v-if='setting.help !== false')
        FormItem(v-if='!$slots.help' label='帮助信息')
          Input(
            type='textarea'
            size='small'
            placeholder='请输入帮助信息'
            v-model='selectedSchema.help'
          )
        template(v-else)
          slot(name='help')

    template(v-if='order.key === "hidden"')
      template(v-if='setting.hidden !== false')
        FormItem(v-if='!$slots.hidden' label='隐藏')
          i-switch(v-model='selectedSchema.hidden')
            span(slot='open') 是
            span(slot='close') 否
        template(v-else)
          slot(name='hidden')

    template(v-if='order.key === "disabled"')
      template(v-if='setting.disabled !== false')
        FormItem(v-if='!$slots.disabled' label='禁用')
          i-switch(v-model='selectedSchema.disabled')
            span(slot='open') 是
            span(slot='close') 否
        template(v-else)
          slot(name='disabled')

    //- template(v-if='order.key === "dynamic"')
    //-   template(v-if='setting.dynamic !== false')
    //-     FormItem(v-if='!$slots.dynamic' label='动态添加')
    //-       i-switch(v-model='selectedSchema.dynamic')
    //-         span(slot='open') 是
    //-         span(slot='close') 否
    //-     template(v-else)
    //-       slot(name='dynamic')

    template(v-if='order.key === "rule"')
      template(v-if='setting.rule !== false')
        template(v-if='!$slots.rule')

          template(v-if='rules && rules.length')
            FormItem(label='必填')
              i-switch(v-model='rules[0].required')
                span(slot='open') 是
                span(slot='close') 否
            FormItem(label='错误提示' v-if='rules[0].required')
              Input(
                type='text'
                size='small'
                placeholder='错误提示信息'
                v-model='rules[0].message'
              )

          .ep-setting-block(v-if='selectedValidators.length')
            h5.ep-setting-block-title 规则

            .ep-rule-item(v-for='(rule, k) in rules' :key='k')
              template(v-if='k !== 0')
                .ep-rule-item-title(:key='k') 规则({{k}})
                  Icon.ep-rule-item-delete(
                    type='android-close'
                    @click.native='deleteRule(k)'
                    title='删除此规则'
                  )
                FormItem(label='类型' v-if='selectedValidators.length')
                  Select(
                    size='small'
                    :transfer='true'
                    v-model='rules[k].type'
                    @on-change='onRuleTypeChange(rules[k].type, k)'
                  )
                    Option(
                      v-for='item in selectedValidators'
                      :key="item.type" :value='item.type'
                    ) {{item.name}}
                ep-widget-rule(
                  :rule='rules[k]'
                  :index='k'
                  @on-message-change='onRuleMessageChange'
                )

            .ep-setting-block-btns
              Button(
                v-if='selectedValidators.length'
                type='dashed'
                size='small'
                @click='addRule'
                icon='plus'
              ) 添加新规则
        template(v-else)
          slot(name='rule')

  slot
</template>
<script>
import EpWidgetRule from './rule.vue'

export default {
  components: {
    EpWidgetRule
  },
  props: {
    orders: {
      type: Array,
      default: () => [
        { key: 'key' },
        { key: 'name' },
        { key: 'label' },
        { key: 'placeholder' },
        { key: 'description' },
        { key: 'help' },
        { key: 'hidden' },
        { key: 'disabled' },
        { key: 'dynamic' },
        { key: 'rule' }
      ]
    },
    setting: {
      type: Object,
      default: () => ({})
    },
    store: {
      type: Object,
      default: () => ({
        types: {},
        state: {}
      })
    }
  },
  data () {
    return {}
  },
  computed: {
    selectedSchema () {
      return this.store.getSelectedSchema()
    },

    rules () {
      return this.store.getSelectedSchema().rules || []
    },

    selectedValidators () {
      const widgetsValidators = this.store.getWidgetsValidators()
      return widgetsValidators[this.selectedSchema.widget] || []
    }
  },
  methods: {
    onRuleTypeChange (type, index) {
      const { key } = this.selectedSchema
      this.store.updateRule(key, index, { type })
    },

    onRuleMessageChange ({ index, message }) {
      const { key } = this.selectedSchema
      this.store.updateRule(key, index, { message })
    },

    addRule () {
      const { key } = this.selectedSchema
      this.store.addRule(key)
    },

    deleteRule (index) {
      const { key } = this.selectedSchema
      this.store.removeRule(key, index)
    }
  }
}
</script>
