
// import Vue from 'vue'
// import Vuex from 'vuex'
import StoreConf from './StoreConf'
import Rule from '../rule'
import types from './types'
import { isNotEmptyString, isArray, getSchema, getFormData, include } from '../helper'
import { modes } from '../constant/static'
const Vuex = require('vuex')

export default class Store {
  constructor (option) {
    this.$$store = {}
    this.$$types = Object.assign({}, types)
    this.$$init(option)
  }

  /**
   * Store init
   * @param {Object} option the specified index logic
   */
  $$init (option) {
    this.$$store = new Vuex.Store(new StoreConf({
      Rule: option.Rule || Rule
    }))
  }

  /**
   * get the state of store
   * @returns {Object} state of store
   */
  getState () {
    return this.$$store.state
  }

  /**
   * get current tab on design page
   * @returns {String} current tab
   */
  getTab () {
    return this.$$store.state.tab
  }

  /**
   * get form data
   * @returns {Object} form data
   */
  getFormData () {
    const { model, rootSchema } = this.$$store.state
    return getFormData(model, rootSchema)
  }

  /**
   * get cleaned root schema
   * @returns {Object} form data
   */
  getSchema () {
    const { rootSchema } = this.$$store.state
    return getSchema(rootSchema)
  }

  /**
   * get selected schema
   * @returns {Schema} selected schema
   */
  getSelectedSchema () {
    return this.$$store.state.selectedSchema
  }

  /**
   * get root schema
   * @returns {Schema} root schema
   */
  getRootSchema () {
    return this.$$store.state.rootSchema
  }

  /**
   * get the form content entered by the user
   * @returns {Object} form data
   */
  getModel (option) {
    if (!option) {
      return this.$$store.state.model
    }
    if (typeof option === 'string') {
      return this.$$store.state.model[option]
    }
  }

  /**
   * update form data
   * @param {Object} model the form data
   */
  updateModel (model = {}) {
    this.$$store.commit(this.$$types.$MODEL_SET, { model })
  }

  /**
   * reset the form
   * @returns {Object} form data
   */
  resetModel () {
    const { model } = this.$$store.state
    const newModel = {}
    for (const i in model) {
      const type = typeof model[i]
      switch (type) {
        case 'string':
          newModel[i] = ''
          break
        case 'number':
          newModel[i] = 0
          break
        case 'boolean':
          newModel[i] = false
          break
        case 'object':
          newModel[i] = isArray(model[i]) ? [] : {}
          break
        default:
          /* eslint no-self-assign: 0 */
          newModel[i] = newModel[i]
          break
      }
    }
    this.$$store.commit(this.$$types.$MODEL_SET, { model: newModel })
  }

  /**
   * get registered widgets
   * @returns {Array} the widget library returns
   */
  getWidgets () {
    return this.$$store.state.widgets
  }

  /**
   * get schema collection object
   * @returns {Object} flated schemas
   */
  getFlatSchemas () {
    return this.$$store.state.flatSchemas
  }

  /**
   * get rule collection object
   * @returns {Object} flated rules
   */
  getFlatRules () {
    return this.$$store.state.flatRules
  }

  /**
   * determine if the widget is selected,
   * generally used in design mode
   * @returns {Boolean} selected or unselected
   */
  isSelected () {
    return this.$$store.getters.isSelected
  }

  /**
   * get widget collection
   * @returns {Object} flated widget
   * @example
   * { input: { Setting, View, Schema }, ...}
   */
  getFlatWidgets () {
    return this.$$store.getters.flatWidgets
  }

  /**
   * get the setting form of the selected widget
   * @returns {Vue Component} vue component form
   */
  getSettingWidget () {
    return this.$$store.getters.settingWidget
  }

  /**
   * get the validators collection of registered widgets
   * @returns {Object} validators
   * @example
   * { input: [StringRule, EmailRule, URLRule, RegExpRule], ...}
   */
  getWidgetsValidators () {
    return this.$$store.getters.widgetsValidators
  }

  /**
   * update view panel in design mode
   * @param {String} tab view panel
   */
  updateTab (tab) {
    if (!isNotEmptyString(tab)) {
      return
    }

    this.$$store.commit(this.$$types.$TAB_UPDATE, { tab })
  }

  /**
   * root schema of epage, should be initialize once
   * @param {Object} rootSchema should be initialize
   */
  initRootSchema (rootSchema) {
    this.$$store.commit(this.$$types.$ROOT_SCHEMA_SET, { rootSchema })
  }

  /**
   * register widgets
   * @param {Array} widgets the widget library returns
   */
  initWidgets (widgets) {
    if (!isArray(widgets)) {
      return console.warning('widgets should be type of array')
    }

    this.$$store.commit(this.$$types.$WIDGETS_SET, { widgets })
  }

  /**
   * update epage mode
   * @enum {String} edit | display
   */
  updateMode (mode) {
    if (!include(modes(), mode)) {
      return console.warning(`mode must be one of ${modes().toString()}`)
    }

    this.$$store.commit(this.$$types.$MODE_CHANGE, { mode })
  }

  /**
   * add widget when has registered widgets
   * @param {String} widget the unique name
   */
  addWidget (widget) {
    if (!isNotEmptyString(widget)) {
      return console.warning('widget should be a non-empty string')
    }

    this.$$store.commit(this.$$types.$WIDGET_ADD, { widget })
  }

  /**
   * dynamic add widget when has registered widgets
   * @param {String} key the unique key of widget
   */
  dynamicAddWidget (key) {
    if (!isNotEmptyString(key)) {
      return console.warning('key should be a non-empty string')
    }

    this.$$store.commit(this.$$types.$WIDGET_DYNAMIC_ADD, { key })
  }

  /**
   * dynamic remove widget when has registered widgets
   * @param {String} key the unique key of widget
   */
  dynamicRemoveWidget (key, index) {
    if (!isNotEmptyString(key)) {
      return console.warning('key should be a non-empty string')
    }

    this.$$store.commit(this.$$types.$WIDGET_DYNAMIC_REMOVE, { key, index })
  }

  /**
   * copy widget when has registered widgets
   * @param {String} key the unique key of widget
   */
  copyWidget (key) {
    if (!isNotEmptyString(key)) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_COPY, { key })
  }

  /**
   * remove from specified widget
   * @param {String} key the unique key of widget
   */
  removeWidget (key) {
    if (!isNotEmptyString(key)) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_REMOVE, { key })
  }

  /**
   * set widget to selected
   * @param {String} key the unique key of selected widget
   */
  selectWidget (key) {
    if (!isNotEmptyString(key)) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_SELECT, { key })
  }

  /**
   * set widget to unselected
   * @param {String} key the unique key of widget
   */
  deselectWidget () {
    this.$$store.commit(this.$$types.$WIDGET_DESELECT)
  }

  /**
   * update the return value type of widget
   * @param {String} key the unique key of widget
   * @param {String} type the new return value type of widget
   */
  updateWidgetType (key, type) {
    if (!isNotEmptyString(key) || !isNotEmptyString(type)) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_TYPE_UPDATE, { key, type })
  }

  /**
   * update the custom props of widget
   * @param {String} key the unique key of widget
   * @param {Object} option should be updated props object
   */
  updateWidgetOption (key, option) {
    if (!isNotEmptyString(key) || !option) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_OPTION_UPDATE, { key, option })
  }

  /**
   * add child schema
   * @param {String} key the unique key of widget
   * @param {Number} index the index of new widget
   * @param {Object} child child element, example: { span: 12, list: [] }
   */
  addWidgetChild (key, index, child) {
    if (!isNotEmptyString(key) || index < 0 || !child) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_CHILD_ADD, { key, index, child })
  }

  /**
   * remove child schema
   * @param {String} key the unique key of widget
   * @param {Number} index the index of widget
   */
  removeWidgetChild (key, index) {
    if (!isNotEmptyString(key)) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_CHILD_REMOVE, { key, index })
  }

  /**
   * move child schema
   * @param {String} key the unique key of widget
   * @param {Number} preIndex the previous index of widget
   * @param {Number} index the index of widget
   */
  moveWidgetChild (key, preIndex, index) {
    if (!isNotEmptyString(key) || preIndex < 0 || index < 0) {
      return
    }

    this.$$store.commit(this.$$types.$WIDGET_CHILD_MOVE, { key, preIndex, index })
  }

  /**
   * trigger other widget props changes based on value changes
   * @param {Object} model the form data
   */
  updateWidgetByModel (model) {
    this.$$store.commit(this.$$types.$WIDGET_UPDATE_BY_VALUE_LOGIC, { model })
  }

  /**
   * trigger other widget props changes based on event triggered
   * @param {String} key the unique key of widget
   * @param {String} eventType event type, looks like click | change | blur and etc.
   */
  updateWidgetByEvent (key, eventType) {
    this.$$store.commit(this.$$types.$WIDGET_UPDATE_BY_EVENT_LOGIC, { key, eventType })
  }

  /**
   * initialize rule
   * @param {Object} rootSchema initialized root schema
   */
  initRule (rootSchema) {
    this.$$store.commit(this.$$types.$RULE_INIT, { rootSchema })
  }

  /**
   * add rule
   * @param {String} key the unique key of widget
   */
  addRule (key) {
    if (!isNotEmptyString(key)) {
      return
    }

    this.$$store.commit(this.$$types.$RULE_ADD, { key })
  }

  /**
   * remove rule
   * @param {String} key the unique key of widget
   * @param {Number} index the specified index rule
   */
  removeRule (key, index) {
    if (!isNotEmptyString(key)) {
      return
    }

    this.$$store.commit(this.$$types.$RULE_REMOVE, { key, index })
  }

  /**
   * update rule
   * @param {String} key the unique key of widget
   * @param {Number} index the specified index rule
   * @param {Object} rule rule detail, https://github.com/yiminghe/async-validator
   * @example
   * rule = { message: 'required', type: 'email' }
   */
  updateRule (key, index, rule) {
    if (!isNotEmptyString(key) || typeof index !== 'number' || typeof rule !== 'object') {
      return
    }
    const { type, message } = rule

    // The first rule is to determine whether it is required
    if (index === 0) {
      this.$$store.commit(this.$$types.$RULE_REQUIRED_RULE_UPDATE, { key, rule })
    } else {
      if (isNotEmptyString(type)) {
        this.$$store.commit(this.$$types.$RULE_TYPE_UPDATE, { key, index, type })
        if (!isNotEmptyString(message)) {
          return
        }
        this.$$store.commit(this.$$types.$RULE_MESSAGE_UPDATE, { key, index, message })
      } else {
        if (!isNotEmptyString(message)) {
          return
        }
        this.$$store.commit(this.$$types.$RULE_MESSAGE_UPDATE, { key, index, message })
      }
    }
  }

  /**
   * add logic
   * @param {Object} logic logic object
   * @example
   * logic = {
   *   type: "event",
   *   key: "ktEAFSAXl",
   *   action: "click",
   *   effects: [{
   *     "key": "kDFnqbKSW",
   *     "properties": [
   *       { key: "hidden", value: true },
   *       { key: "disabled", value: false }
   *     ]
   *   }]
   * }
   */
  addLogic (logic) {
    if (!logic) {
      return
    }

    this.$$store.commit(this.$$types.$LOGIC_ADD, { logic })
  }

  /**
   * update logic
   * @param {Number} index the specified index logic
   * @param {Object} logic logic object
   */
  updateLogic (index, logic) {
    if (index < 0 || !logic) {
      return
    }

    this.$$store.commit(this.$$types.$LOGIC_UPDATE, { index, logic })
  }

  /**
   * remove logic
   * @param {Number} index the specified index logic
   */
  removeLogic (index) {
    if (index < 0) {
      return
    }

    this.$$store.commit(this.$$types.$LOGIC_DELETE, { index })
  }
}
