<template lang="pug">
.ep-logic
  h3.ep-logic-title 逻辑配置表
  .ep-logic-btns
    Button.ep-logic-btn-value(
      :size='size'
      @click='addLogic("value")'
    ) + 值逻辑
    Button.ep-logic-btn-event(
      :size='size'
      @click='addLogic("event")'
    ) + 事件逻辑
  table.ep-logic-table
    //- colgroup
    //-   col(width='8%')
    //-   col(width='15%')
    //-   col(width='10%')
    //-   col(width='15%')
    //-   col(width='37%')
    //-   col(width='15%')
    thead
      tr
        th 类型
        th 主控widget
        th 行为
        th 值
        th 受控widget
        th 操作
    tbody
      tr(v-for='(logic, key) in schema.logics' :key='key')
        td {{map.logic[logic.type].title}}
        td {{getSchemaText(logic.key)}}
        td {{map.logic[logic.type].map[logic.action].value}}
        td {{logic.type === "value" ? logic.value : '--'}}
        td
          Row.ep-logic-action(v-for='(effect, i) in logic.effects' :key="i")
            Col(span='12').ep-logic-controlled {{getSchemaText(effect.key)}}
            Col(span='12')
              span(v-for='(prop, j) in effect.properties' :key='j')
                Tag(color='blue') {{map.prop[prop.key].text}}: {{map.prop[prop.key].option[prop.value ? 'open': 'close']}}
        td
          Button(size='small' type='ghost' @click='onEdit(logic, key)' icon="edit" title='编辑' style='margin-right: 6px;')
          Button(size='small' type='ghost' @click='onDelete(key)' icon="trash-a" title='删除')

  .ep-logic-table-empty(v-if='!schema.logics || schema.logics.length === 0') 暂无逻辑配置

  Modal(
    v-model='modal.visible'
    :title='modal.title'
    :loading='modal.loading'
    @on-ok='onModalOk'
  )
    logic-form(
      :logic='modal.logic'
      :store='store'
      :map='map'
      @on-change='onLogicChange'
      @on-add-effect='onAddEffect')
</template>
<script>
import Logic from './Logic'
import LogicForm from './LogicForm'

const logic = new Logic()
const map = {
  logic: logic.map,
  type: {
    value: '当',
    event: '发生'
  },
  prop: {
    hidden: {
      text: '隐藏',
      option: {
        open: '是',
        close: '否'
      }
    },
    disabled: {
      text: '禁用',
      option: {
        open: '是',
        close: '否'
      }
    }
  }
}

export default {
  components: { LogicForm },
  props: {
    store: {
      type: Object,
      default: () => ({
        state: {}
      })
    }
  },
  data () {
    return {
      size: 'small',
      map,
      modal: {
        title: '逻辑设置',
        visible: false,
        loading: false,
        // -1 为添加规则
        index: -1,
        logic: {
          type: '',
          key: '',
          action: '',
          value: '',
          effects: []
        }
      }
    }
  },
  computed: {
    schema () {
      return this.store.getRootSchema() || {}
    },
    flatSchemas () {
      return this.store.getFlatSchemas()
    },
    flatWidgets () {
      return this.store.getFlatWidgets() || {}
    },
    schemaList () {
      return Object.keys(this.flatSchemas).map(key => this.flatSchemas[key])
    }
  },
  methods: {
    getSchemaText (key) {
      const schema = this.flatSchemas[key] || {}
      const label = schema.label || ''
      const option = schema.option || {}
      return label.trim() || option.text || key
    },
    addLogic (type) {
      if (this.map.logic[type]) {
        this.modal.visible = true
        const logic = this.map.logic[type].get()
        this.modal.logic = logic
      }
    },
    onDelete (index) {
      this.store.removeLogic(index)
    },
    onEdit (logic, index) {
      this.modal.visible = true
      this.modal.logic = JSON.parse(JSON.stringify(logic))
      this.modal.index = index
    },
    onModalOk () {
      const { type, key, action, effects } = this.modal.logic
      const { index, logic } = this.modal
      function chectEffects (effects) {
        // const checkProperties = properties => properties.filter(prop => prop.value).length
        const checkProperties = properties => properties.length > 0
        return Array.isArray(effects) && effects.filter(e => e.key && checkProperties(e.properties)).length === effects.length
      }
      if (type && key && action && chectEffects(effects)) {
        if (index > -1) {
          this.store.updateLogic(index, logic)
          // 回归默认
          this.modal.index = -1
        } else {
          this.store.addLogic(logic)
        }
      }
    },
    onLogicChange (logic) {
      this.modal.logic = logic
    },
    onAddEffect (effect) {
      this.modal.logic.effects.push(effect)
    }
  }
}
</script>
