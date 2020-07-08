<template lang="pug">
.ep-logic-form
  Form(:label-width='100')
    FormItem(label='主控widget')
      Select(v-model="curLogic.key")
        Option(
          v-for='schema in logicSchemaList[curLogic.type]'
          :key='schema.key'
          :value="schema.key"
        ) {{getSchemaText(schema.key)}}

    FormItem(:label='map.type[curLogic.type] || "关系"')
      Select(v-model="curLogic.action")
        Option(
          v-for='relation in getLogicOption(curLogic)'
          :key='relation'
          :value="relation"
        ) {{getRelationText(curLogic.type, relation)}}

    FormItem(label='值' v-if='curLogic.type === "value"')
      Input(v-model="curLogic.value" placeholder="请输入值")

    FormItem(
      v-for='(effect, i) in controlledWidgetEffects'
      :key='i'
      :label='`受控widget-${i + 1}`'
    )
      Row.ep-logic-controlled-border
        Col(span='20')
          Select(v-model="controlledWidgetEffects[i].key")
            Option(
              v-for='schema in getUnControlledSchemaList(curLogic)'
              :key='schema.key'
              :value="schema.key"
            ) {{getSchemaText(schema.key)}}
          Row
            Col(v-for='prop in effect.properties' :key='prop.key' span='12')
              FormItem(:label='map.prop[prop.key].text' :label-width='80')
                i-switch(v-model='prop.value')
                  span(slot='open') {{map.prop[prop.key].option.open}}
                  span(slot='close') {{map.prop[prop.key].option.close}}
        Col(span='4')
          Button(
            type='text'
            size="small"
            icon='plus'
            @click='onAddEffect'
          )
          Button(
            v-show="controlledWidgetEffects.length > 1"
            type='text'
            size="small"
            icon='minus'
            @click='onRemoveEffect(i)'
          )
</template>
<script>
import { isArray } from '../../../modules/helper'
import Logic from '../../../modules/logic'
const { Effect } = Logic

export default {
  props: {
    logic: {
      type: Object,
      default: () => ({
        key: '',
        action: '',
        value: '',
        effects: []
      })
    },
    map: {
      type: Object,
      default: () => ({
        logic: {},
        type: {},
        prop: {}
      })
    },
    store: {
      type: Object,
      default: () => ({
        state: {}
      })
    }
  },
  data () {
    return {
      curLogic: this.logic
    }
  },
  computed: {
    flatSchemas () {
      return this.store.getFlatSchemas()
    },
    flatWidgets () {
      return this.store.getFlatWidgets() || {}
    },
    schemaList () {
      return Object.keys(this.flatSchemas).map(key => this.flatSchemas[key])
    },
    logicSchemaList () {
      const { flatSchemas, flatWidgets } = this
      const logicList = {
        event: [],
        value: []
      }
      const getList = (schema, type, logicList) => {
        const widgetLogic = flatWidgets[schema.widget].Schema.logic || {}
        if (
          isArray(widgetLogic[type]) &&
          widgetLogic[type].length &&
          !schema.container
        ) {
          logicList[type].push(schema)
        }
      }
      for (const i in flatSchemas) {
        const item = flatSchemas[i]
        getList(item, 'event', logicList)
        getList(item, 'value', logicList)
      }
      return logicList
    },
    controlledWidgetEffects () {
      return (this.curLogic.effects || [])
        .filter(item => this.curLogic.key !== item.key)
    }
  },
  watch: {
    logic (value) {
      this.curLogic = value
    },
    curLogic (value) {
      this.$emit('on-change', value)
    }
  },
  methods: {
    getRelationText (logicType, relation) {
      return this.map.logic[logicType].map[relation].value
    },
    getSchemaText (key) {
      const schema = this.flatSchemas[key] || {}
      const label = schema.label || ''
      const option = schema.option || {}

      return label.trim() || option.text || key
    },
    getLogicOption ({ key, type }) {
      let result = []
      const { flatWidgets } = this
      const schema = this.schemaList.filter(item => item.key === key)[0] || {}
      const widget = flatWidgets[schema.widget]

      if (widget && widget.Schema && type in widget.Schema.logic) {
        result = widget.Schema.logic[type]
      }
      // if (schema.logic && type in schema.logic) result = schema.logic[type]
      return result
    },
    getUnControlledSchemaList ({ key, type }) {
      return this.schemaList.filter(item => item.key !== key)
    },
    onAddEffect () {
      const effect = new Effect()
      // {
      //   key: '',
      //   properties: [
      //     { key: 'hidden', value: false },
      //     { key: 'disabled', value: false }
      //   ]
      // }
      this.$emit('on-add-effect', effect)
    },
    onRemoveEffect (index) {
      this.curLogic.effects.splice(index, 1)
      this.$emit('on-remove-effect', index)
    }
  }
}
</script>
