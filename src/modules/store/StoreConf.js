import types from './types'
import TypeBuilder from './TypeBuilder'
import { defaultSchema } from '../constant'
import RootSchema from '../schema/RootSchema'
import EventLogic from '../../panel/logic/EventLogic'
import ValueLogic from '../../panel/logic/ValueLogic'
import Logic from '../../panel/logic/Logic'

import {
  flattenSchema,
  isFunction,
  isArray,
  include,
  getParentListByKey,
  getIndexByKey,
  getRootSchemaChildren,
  getWidgetType,
  isNotEmptyString,
  checkValueType,
  getWidgetModel,
  updateRequiredRule
} from '../helper'

const logic = new Logic([new EventLogic(), new ValueLogic()])
const typeBuilder = new TypeBuilder()
const rootSchema = new RootSchema()
const selectedSchema = defaultSchema()

export default class StoreConf {
  constructor (option) {
    const { Rule } = option || {}
    return {
      state: {
        // 设计模式下当前tab，可选 design | preview
        tab: '',
        mode: 'edit',
        selectedSchema,
        rootSchema,
        model: {},
        widgets: [],
        // 拍平所有schema
        flatSchemas: {},
        // 拍平所有规则
        flatRules: {}
      },
      getters: {
        isSelected: state => !!state.selectedSchema.key,
        flatWidgets: ({ widgets }) => {
          const serialized = {}
          if (!isArray(widgets)) {
            return serialized
          }
          widgets.forEach(item => {
            if (!isArray(item.widgets)) {
              return
            }
            item.widgets.forEach(w => {
              if (isFunction(w.Schema)) {
                serialized[w.Schema.widget] = w
              }
            })
          })
          return serialized
        },

        settingWidget: (state, getters) => {
          const { widget: widgetName, key } = state.selectedSchema
          const widget = getters.flatWidgets[widgetName] || null

          return key && widget ? widget.Setting : null
        },

        // widget schema 声明需要哪些规则validator
        widgetsValidators: (state, { flatWidgets }) => {
          const map = {}
          for (const i in flatWidgets) {
            const { Schema } = flatWidgets[i]
            if (!isFunction(Schema) || !isArray(Schema.validators)) {
              return
            }
            map[i] = []
            Schema.validators.forEach(validator => {
              const val = Rule.rules[validator]

              if (!val) {
                return console.log(`validator ${validator} is not exist`)
              }
              map[i].push(Rule.rules[validator])
            })
          }
          return map
        }
      },
      mutations: {
        [types.$TAB_UPDATE] (state, { tab }) {
          if (tab && typeof tab === 'string') {
            state.tab = tab
          }
        },
        [types.$RULE_INIT] (state, { rootSchema }) {
          state.flatRules = new Rule(rootSchema).rules
        },
        [types.$ROOT_SCHEMA_FLAT] (state, { rootSchema }) {
          state.flatSchemas = flattenSchema(rootSchema)
        },

        // 添加全局schema，会重新修改store中model数据
        [types.$ROOT_SCHEMA_SET] (state, { rootSchema }) {
          const { flatWidgets } = this.getters
          const model = {}
          const _rootSchema = new RootSchema({ schema: rootSchema, widgets: flatWidgets })

          // 初始化 model
          state.rootSchema = Object.assign({}, state.rootSchema, _rootSchema)
          this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: state.rootSchema })
          this.commit(types.$RULE_INIT, { rootSchema: state.rootSchema })

          // 遍历schema获取model默认值
          for (const i in state.flatSchemas) {
            if (!(i in state.model)) {
              const schema = state.flatSchemas[i]
              // 容器widget不保留model值
              if (schema.container) {
                continue
              }
              const type = getWidgetType(flatWidgets, schema.widget)
              const widgetModel = getWidgetModel(type, schema, typeBuilder)

              Object.assign(model, widgetModel)
            }
          }
          this.commit(types.$MODEL_SET, { model })
        },

        // 添加表单展示模式
        [types.$MODE_CHANGE] (state, { mode }) {
          state.mode = mode
        },

        // 设置表单model，即用户填写的表单数据
        [types.$MODEL_SET] (state, { model }) {
          const _model = {}
          const conbinedModel = Object.assign({}, state.model, model)
          const { flatSchemas } = state
          const { flatWidgets } = this.getters

          for (const i in conbinedModel) {
            const schema = flatSchemas[i]

            if (!schema) {
              continue
            }
            const Widget = flatWidgets[schema.widget]

            if (!Widget || !isFunction(Widget.Schema)) {
              continue
            }
            if (checkValueType(conbinedModel[i], Widget.Schema.type, schema.dynamic)) {
              _model[i] = conbinedModel[i]
            }
          }
          state.model = _model
        },

        // 配置供展示的所有widget列表
        [types.$WIDGETS_SET] (state, { widgets }) {
          state.widgets = widgets
        },

        // value logic改变影响 widget 属性改变
        [types.$WIDGET_UPDATE_BY_VALUE_LOGIC] (state, { model }) {
          const valueLogics = state.rootSchema.logics.filter(logic => logic.key && logic.type === 'value')
          const patches = logic.diffValueLogics(valueLogics, model)

          logic.applyPatches(state.flatSchemas, patches)
        },

        // event logic改变影响 widget 属性改变
        [types.$WIDGET_UPDATE_BY_EVENT_LOGIC] (state, { key, eventType }) {
          // key 为当前触发的widget key
          const eventLogics = state.rootSchema.logics.filter(logic => logic.key === key && logic.type === 'event')
          const patches = logic.diffEventLogics(eventLogics, eventType)

          logic.applyPatches(state.flatSchemas, patches)
        },

        // 设计模式向表单添加一个widget，schema为此widget对应的默认schema
        // 目前默认添加到整个表单最后
        [types.$WIDGET_ADD] (state, { widget }) {
          const { selectedSchema, rootSchema } = state
          const { flatWidgets, isSelected } = this.getters
          const WidgetSchema = flatWidgets[widget].Schema

          if (!isFunction(WidgetSchema)) {
            return console.error('Schema should be a constructor')
          }

          let childrenSchema = []
          const newSchema = new WidgetSchema({ widgets: flatWidgets })
          if (isSelected) {
            childrenSchema = getParentListByKey(selectedSchema.key, rootSchema)
            const index = getIndexByKey(selectedSchema.key, childrenSchema)
            childrenSchema.splice(index + 1, 0, newSchema)
          } else {
            childrenSchema = getRootSchemaChildren(rootSchema)
            childrenSchema.push(newSchema)
          }
          this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: Object.assign({}, rootSchema) })
          this.commit(types.$RULE_INIT, { rootSchema: Object.assign({}, rootSchema) })

          const type = getWidgetType(flatWidgets, newSchema.widget)
          const model = getWidgetModel(type, newSchema, typeBuilder)
          this.commit(types.$MODEL_SET, { model })
          state.selectedSchema = newSchema
        },

        [types.$WIDGET_DYNAMIC_ADD] (state, { key }) {
          const widgets = this.getters.flatWidgets
          const { flatSchemas } = state
          const currentSchema = flatSchemas[key]
          const WidgetSchema = widgets[currentSchema.widget].Schema
          const schema = Object.assign({}, currentSchema, { list: [], dynamic: false })
          const newSchema = new WidgetSchema({ schema, widgets, clone: true, dynamic: true })
          // 动态添加的子schema不能为dynamic
          newSchema.dynamic = false
          const flatedSchema = flattenSchema(newSchema)
          const flatedRules = new Rule(newSchema).rules

          currentSchema.list.push(newSchema)
          const newSchemas = {
            [newSchema.key]: newSchema,
            ...flatedSchema
          }
          state.flatSchemas = Object.assign({}, state.flatSchemas, newSchemas)
          state.flatRules = Object.assign({}, state.flatRules, { ...flatedRules, [newSchema.key]: newSchema.rules })

          // 初始默认值即可，获取表单数据通过方法组装嵌套格式
          const model = {}
          if (!isArray(state.model[key])) {
            model[key] = []
          }
          // 新建的schema及可能的子孙schema
          for (const k in newSchemas) {
            const { type, key } = newSchemas[k]
            const builder = typeBuilder.types[type]
            if (type && isFunction(builder)) {
              model[key] = builder()
            }
          }
          state.model = Object.assign({}, state.model, model)
        },

        [types.$WIDGET_DYNAMIC_REMOVE] (state, { key, index }) {
          const { flatSchemas, flatRules, model } = state
          const currentSchema = flatSchemas[key]
          const removedSchema = currentSchema.list.splice(index, 1)[0]
          const { key: skey } = removedSchema

          delete flatSchemas[skey]
          delete flatRules[skey]
          delete model[skey]
          state.flatSchemas = Object.assign({}, flatSchemas)
          state.flatRules = Object.assign({}, flatRules)
          state.model = Object.assign({}, model)
        },

        // 设计模式复制一个widget
        [types.$WIDGET_COPY] (state, { key }) {
          const { flatSchemas, rootSchema } = state
          const schema = flatSchemas[key]
          const { flatWidgets } = this.getters
          const WidgetSchema = flatWidgets[schema.widget].Schema
          const parentList = getParentListByKey(key, rootSchema)
          const index = getIndexByKey(key, parentList)
          const newSchema = new WidgetSchema({ schema, widgets: flatWidgets, clone: true })

          parentList.splice(index + 1, 0, newSchema)
          this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: Object.assign({}, rootSchema) })
          this.commit(types.$RULE_INIT, { rootSchema: Object.assign({}, rootSchema) })

          // set default value
          const type = getWidgetType(flatWidgets, newSchema.widget)
          const model = getWidgetModel(type, newSchema, typeBuilder)
          this.commit(types.$MODEL_SET, { model })

          // set selectedSchema
          state.selectedSchema = newSchema
        },

        // 设计模式删除一个widget
        [types.$WIDGET_REMOVE] (state, { key }) {
          const parentList = getParentListByKey(key, state.rootSchema)
          const index = getIndexByKey(key, parentList)
          const model = Object.assign({}, state.model)

          if (isNotEmptyString(key)) {
            delete model[key]
            state.model = model
          }
          parentList.splice(index, 1)
          this.commit(types.$ROOT_SCHEMA_FLAT, { rootSchema: Object.assign({}, state.rootSchema) })
          this.commit(types.$RULE_INIT, { rootSchema: Object.assign({}, state.rootSchema) })
          this.commit(types.$WIDGET_DESELECT)
        },

        // 设计模式修改选中一个widget的type(返回值类型)
        [types.$WIDGET_TYPE_UPDATE] ({ model, flatSchemas }, { key, type }) {
          const schema = flatSchemas[key]
          const { widget } = schema
          const { flatWidgets } = this.getters
          const widgetType = getWidgetType(flatWidgets, widget)
          const WidgetSchema = flatWidgets[widget].Schema

          if (!widgetType || !type) {
            return
          }

          updateRequiredRule(schema, WidgetSchema, { type: TypeBuilder.resolve(type, true) })
          if (!isArray(widgetType)) {
            schema.type = type
            return
          }
          if (!include(widgetType, type)) {
            return console.warn(`${type}不是widget(${widget})值类型`)
          }

          schema.type = type
          const value = model[key]
          if (include(type, 'array')) {
            if (isArray(value)) {
              return
            }
            // model[key] = [value]
            model[key] = []
          } else {
            const builder = typeBuilder.types[type]
            if (isArray(value) && isFunction(builder)) {
              model[key] = builder()
            }
          }
        },

        // 设计模式修改选中一个widget的option
        [types.$WIDGET_OPTION_UPDATE] ({ flatSchemas }, { key, option }) {
          const schema = flatSchemas[key]

          if (!schema || !option) {
            return
          }
          schema.option = Object.assign({ ...schema.option }, option)
        },

        // 设计模式选中一个widget
        [types.$WIDGET_SELECT] (state, { key }) {
          const schema = state.flatSchemas[key]
          const isSameWidget = state.selectedSchema.key === key

          if (state.tab !== 'design' || isSameWidget || !schema) {
            return
          }
          state.selectedSchema = schema
        },

        // 设计模式取消选中一个widget
        [types.$WIDGET_DESELECT] (state) {
          state.selectedSchema = defaultSchema()
        },

        // 设计模式为选中widget修改规则类型
        [types.$RULE_TYPE_UPDATE] ({ flatRules, flatSchemas }, { key, type, index }) {
          const schema = flatSchemas[key]
          const { widgetsValidators } = this.getters
          const widgetValidators = widgetsValidators[schema.widget]

          if (!isArray(widgetValidators)) {
            return
          }
          const Rule = widgetValidators.find(v => v.type === type)
          if (!isFunction(Rule)) {
            return
          }
          const newRule = new Rule().rule
          const currentRules = flatRules[key]
          const originRules = [...schema.rules]

          currentRules.splice(index, 1, newRule)
          originRules.splice(index, 1, { message: newRule.message, type })
          schema.rules = originRules
        },

        [types.$RULE_REQUIRED_RULE_UPDATE] ({ flatRules, flatSchemas }, { key, rule }) {
          const schema = flatSchemas[key]
          const WidgetSchema = this.getters.flatWidgets[schema.widget].Schema

          updateRequiredRule(schema, WidgetSchema, rule)
        },

        // 设计模式为选中widget修改规则错误消息
        [types.$RULE_MESSAGE_UPDATE] ({ flatRules }, { key, index, message }) {
          const currentRules = flatRules[key]

          if (!Array.isArray(currentRules)) {
            return
          }
          currentRules[index].message = message
        },

        // 设计模式为选中widget添加规则
        [types.$RULE_ADD] ({ flatSchemas }, { key }) {
          const schema = flatSchemas[key]
          const defaultRule = { type: '', message: '' }

          schema.rules.push(defaultRule)
        },

        // 设计模式为选中widget删除规则
        [types.$RULE_REMOVE] ({ flatRules, flatSchemas }, { key, index }) {
          const schema = flatSchemas[key]
          const rules = flatRules[key]

          schema.rules.splice(index, 1)
          if (!rules) {
            return
          }
          rules.splice(index, 1)
        },

        // 设计模式为选中widget的可变列表属性，执行添加操作
        [types.$WIDGET_CHILD_ADD] ({ flatSchemas }, { key, index, child }) {
          const schema = flatSchemas[key]

          schema.children.splice(index + 1, 0, child)
        },

        // 设计模式为选中widget的可变列表属性，执行删除操作
        [types.$WIDGET_CHILD_REMOVE] ({ flatSchemas }, { key, index }) {
          const schema = flatSchemas[key]

          schema.children.splice(index, 1)
        },

        // 设计模式为选中widget的可变列表属性，执行移动操作
        [types.$WIDGET_CHILD_MOVE] ({ flatSchemas }, { key, preIndex, index }) {
          const schema = flatSchemas[key]
          const children = [...schema.children]

          children.splice(preIndex, 1, ...children.splice(index, 1, children[preIndex]))
          schema.children = children
        },

        // 逻辑模式添加一个逻辑规则
        [types.$LOGIC_ADD] ({ rootSchema }, { logic }) {
          if (isArray(rootSchema.logics)) {
            rootSchema.logics.push(logic)
          } else {
            rootSchema.logics = [logic]
          }
        },

        // 逻辑模式更新一个逻辑规则
        [types.$LOGIC_UPDATE] ({ rootSchema }, { logic, index }) {
          rootSchema.logics.splice(index, 1, logic)
        },

        // 逻辑模式删除一个逻辑规则
        [types.$LOGIC_DELETE] ({ rootSchema }, { index }) {
          rootSchema.logics.splice(index, 1)
        }
      },
      actions: {},
      modules: {}
    }
  }
}
