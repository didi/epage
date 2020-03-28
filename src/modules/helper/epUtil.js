
import { randomStr, isNotEmptyString, isArray, isFunction, include, jsonClone, checkValueType } from './util'
import TypeBuilder from '../store/TypeBuilder'

/**
 * 获取根 schema 的子schema列表
 * @param {Object} schema 根schema
 */
export function getRootSchemaChildren (schema) {
  const list = []

  if (!schema || !schema.container) {
    return list
  }
  if (!isArray(schema.children)) {
    schema.children = []
  }

  const row = schema.children[0]
  if (!row) {
    return list
  }
  if (!isArray(row.list)) {
    row.list = []
  }
  return row.list
}

/**
 * 获表单待提交的form data值
 * @param {Object} model store中或初始化的model数据
 * @param {Schema} rootSchema 根节点schema
 */
export function getFormData (model, rootSchema) {
  const formData = {}
  const baseTypes = ['string', 'number', 'boolean']
  const convert = (t1, t2, v) => {
    if (include(baseTypes, t1) && include(baseTypes, t2)) {
      return t1 === t2 ? v : TypeBuilder.convert[`${t1}2${t2}`](v)
    }
    return v
  }
  const cleanValue = (value, schema) => {
    const resolvedType = TypeBuilder.resolve(schema.type)
    return isArray(value)
      ? value.map(v => convert(typeof v, resolvedType, v))
      : convert(typeof value, resolvedType, value)
  }

  const getSchemaForm = function (schema, listItem) {
    const result = {}
    const { container, name, dynamic, list = [], key, group, children } = schema
    if (dynamic) {
      if (container) {
        result[name] = list.map(sc => {
          return getSchemaForm(sc, dynamic)
        })
      } else {
        result[name] = list.map(sc => {
          return cleanValue(model[sc.key], sc)
        })
      }
    } else {
      if (container) {
        if (group) {
          const tmpResult = {}
          children.forEach(child => {
            child.list.forEach(sc => {
              Object.assign(tmpResult, getSchemaForm(sc, false))
            })
          })
          if (listItem) {
            Object.assign(result, tmpResult)
          } else {
            result[name] = tmpResult
          }
        } else {
          children.forEach(child => {
            child.list.forEach(sc => {
              Object.assign(result, getSchemaForm(sc))
            })
          })
        }
      } else {
        result[name] = cleanValue(model[key], schema)
      }
    }
    return result
  }

  const { children = [] } = rootSchema
  children.forEach(child => {
    child.list.forEach(sc => {
      Object.assign(formData, getSchemaForm(sc))
      // if (sc.container && sc.group) {
      //   formData[sc.name] = getSchemaForm(sc)
      // } else {
      //   Object.assign(formData, getSchemaForm(sc))
      // }
    })
  })

  return formData
}
/**
 * get root schema and remove unused field
 * @param {Schema} schema root schema
 */
export function getSchema (_schema) {
  if (!_schema) {
    return {}
  }
  const schema = jsonClone(_schema)
  function clean (schema) {
    const option = schema.option || {}
    for (const i in option) {
      if (i === 'dynamicData') {
        option[i] = []
      }
      // iview table field
      if (i === 'columns' && isArray(option[i])) {
        option[i].forEach(col => delete col.__id)
      }
    }
    if (schema.container && isArray(schema.children)) {
      schema.children.forEach(child => {
        if (isArray(child.list)) {
          child.list.forEach(s => clean(s))
        }
      })
    }
  }
  clean(schema)
  return schema
}

/**
 * 通过schema key 在指定容器schame或根schema找到key对应schema最近一层父级子列表
 * @param {String} key schema key
 * @param {Schema} schema 根schema或容器级schema
 */
export function getParentListByKey (key, schema) {
  const tmpSchema = schema
  let parentList = null
  function getParent (key, schema) {
    if (schema.container) {
      const { children } = schema
      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        for (let k = 0; k < child.list.length; k++) {
          const subSchema = child.list[k]
          if (key === subSchema.key) {
            parentList = child.list
            break
          } else {
            getParent(key, subSchema)
          }
        }
        if (parentList) {
          break
        }
      }
    }
  }
  if (key) {
    getParent(key, tmpSchema)
  }
  if (!parentList) {
    const { children } = tmpSchema
    if (
      isArray(children) &&
      children[0] &&
      isArray(children[0].list)
    ) parentList = children[0].list
  }
  return parentList
}

/**
 * 在schema列表中找到指定schema key对应的index值
 * @param {String} key shchema key
 * @param {Array<String>} list schema 列表
 */
export function getIndexByKey (key, list) {
  let index = -1
  if (isNotEmptyString(key) && isArray(list)) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].key === key) {
        index = i
        break
      }
    }
  }
  return index
}

/**
 * 替换指定schema极其所有子schema的key，一般复制widget用到
 * @param {Schema} schema 根schema或子schema
 */
export function replaceSchemaKey (schema) {
  function recursiveSchema (schema) {
    const { container, children } = schema
    if (container && isArray(children)) {
      children.forEach(child => {
        if (isArray(child.list)) {
          child.list.forEach(item => recursiveSchema(item))
        }
      })
    }
    schema.key = randomStr()
    schema.name = schema.key
  }
  recursiveSchema(schema)
  return schema
}

/**
 * 递归遍历对象，拉平指定key
 * @param {Schema Object} obj 待遍历的对象
 */
export function flattenSchema (schema) {
  const result = {}
  const ecursive = (schema, result) => {
    const { dynamic, list, container, children } = schema || {}

    if (dynamic && isArray(list)) {
      list.forEach(sc => ecursive(sc, result))
    }

    if (!container || !isArray(children)) {
      return
    }

    children.forEach(child => {
      const list = child.list || []
      list.forEach(item => {
        const { key } = item

        if (isNotEmptyString(key) && result[key] === undefined) {
          result[key] = item
          ecursive(item, result)
        }
      })
    })
  }
  ecursive(schema, result)
  return result
}

// 获取指定widget的数据类型，相同widget应该是统一的数据类型
export function getWidgetType (flatWidgets = {}, widget) {
  let type = null
  for (const i in flatWidgets) {
    const { Schema } = flatWidgets[i]
    if (isFunction(Schema) && Schema.widget === widget) {
      type = Schema.type
      break
    }
  }
  return type
}

// 根据Schema.type及schema.key获取默认model值
export function getWidgetModel (SchemaType, schema, typeBuilder) {
  if (!SchemaType || !isNotEmptyString(schema.key)) {
    return {}
  }
  // 初始化数据默认model值
  const defaultType = isArray(SchemaType) ? SchemaType[0] : SchemaType
  // 优先schema 中type字段指定值类型，没有设定使用当前widget类型的默认值类型
  const builder = typeBuilder.types[schema.type || defaultType]
  const model = { [schema.key]: '' }
  if (isFunction(builder)) {
    model[schema.key] = builder()
  }
  return model
}

/**
 * 检查并设置schema key 及 name
 * @param {Object} schema 待实例化的JSON
 * @param {Boolean} clone 是否复制
 * @param {Boolean} dynamic 是否为动态添加
 */
export function setKeyAndName (schema, clone, dynamic) {
  if (!isNotEmptyString(schema.key)) {
    schema.key = randomStr()
    if (!schema.name) {
      schema.name = schema.key
    }
  } else {
    if (clone) {
      schema.key = randomStr()
    }
    if (!schema.name) {
      schema.name = schema.key
    }
  }
  if (clone && !dynamic) {
    schema.name = schema.key
  }
}

/**
 * merge widget group
 * @param {Array} widgets 所有 widget 组，后面支持多个group级参数
 * @returns {Array} 返回新widget组
 */
export function mergeWidgets (widgets) {
  const result = isArray(widgets) ? [...widgets] : []
  const groups = Array.prototype.slice.call(arguments, 1)
  const filterWidgets = result.filter(w => !include(groups.map(k => k.key), w.key))

  return filterWidgets.concat(groups)
}

/**
 * merge 单个 widget
 * @param {Array} widgets 所有widget 组
 * @param {Object} widget widget对象 { type, key, widget: { Widget, Setting, schema }}
 * @returns {Array} 返回widget组
 */
export function mergeWidget (widgets, widget) {
  let hasWidget = false
  const groups = isArray(widgets) ? widgets : []

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    if (!isArray(group.widgets)) {
      group.widgets = []
    }
    for (let j = 0; j < group.widgets; j++) {
      const wSchema = widget.Schema
      const gSchema = group.widgets[j].Schema

      if (wSchema && gSchema && wSchema.widget === gSchema.widget) {
        hasWidget = true
        group.widgets[j] = widget
        break
      }
    }
    if (hasWidget) {
      break
    }
  }
  if (!hasWidget) {
    if (groups.length === 0) {
      groups.push({ title: '基础', key: 'base', widgets: [widget] })
    }
    if (isArray(groups[0].widgets)) {
      groups[0].widgets.push(widget)
    } else {
      groups[0].widgets = [widget]
    }
  }
  return groups
}

/**
 * 设置validators
 * @param {Array<widgets>} groups widgets 分组
 * @param {Object<key: widget, value: validators>} validator 自定义的validator
 * @param {Boolean} replace 是否替换默认validator，还是与默认merge
 * example: 为input widget追加 phone规则，phone规则需要提前配置
 * setValidators(widgetsGroup, {input: ['phone']})
 */
export function setValidators (groups, validator, replace) {
  if (!(isArray(groups) || !validator)) {
    return
  }
  // 循环widget group
  for (let i = 0, len = groups.length; i < len; i++) {
    const group = groups[i]
    const { widgets = [] } = group || {}
    // 循环特定组的widgets 列表
    widgets.forEach(widget => {
      // 循环自定义validator 对象
      for (const k in validator) {
        if (!widget.Schema || k !== widget.Schema.widget) {
          continue
        }
        const customValidators = validator[k]
        if (!isArray(customValidators)) {
          continue
        }
        const validators = widget.Schema.validators || []
        if (replace) {
          widget.Schema.validators = customValidators
        } else {
          widget.Schema.validators = validators
          // 检查自定义widget是否已经与默认重复，重复将不添加
          customValidators.forEach(v => {
            if (!include(validators, v)) {
              validators.push(v)
            }
          })
        }
      }
    })
  }
}

/**
 * get and check rule type
 * @param {schema} schema widget schema. required
 * @param {Schema} WidgetSchema Schema class. not required
 */
export function getSchemaType (schema, WidgetSchema) {
  const widgetType = (WidgetSchema && WidgetSchema.type) ? WidgetSchema.type : null
  const schemaType = schema && isNotEmptyString(schema.type) ? schema.type : null
  // 缺省值
  let type = 'string'
  if (isArray(widgetType) && widgetType.length) {
    type = include(widgetType, schemaType) ? schemaType : widgetType[0]
  } else if (isNotEmptyString(widgetType)) {
    type = widgetType
  }
  return type
}

/**
 * get and check required rule type. schema.rules[0]
 * @param {schema} schema widget schema. required
 * @param {Schema} WidgetSchema Schema class. not required
 */
export function getRequiredRuleType (schema, WidgetSchema) {
  // const widgetType = (WidgetSchema && WidgetSchema.type) ? WidgetSchema.type : null
  // const schemaType = schema && isNotEmptyString(schema.type) ? schema.type : null
  // // 缺省值
  // let type = 'string'
  // if (isArray(widgetType) && widgetType.length) {
  //   type = include(widgetType, schemaType) ? schemaType : widgetType[0]
  // } else if (isNotEmptyString(widgetType)) {
  //   type = widgetType
  // }
  const type = getSchemaType(schema, WidgetSchema)
  return TypeBuilder.resolve(type, true)
}

/**
 * update required rule and Check the validity of the type
 * @param {schema} schema widget shcema. required
 * @param {Schema} WidgetSchema Schema class. not required
 * @param {Object} rule should updated rule. not required
 */
export function updateRequiredRule (schema, WidgetSchema, rule) {
  if (!schema || !isArray(schema.rules)) {
    return
  }
  const requiredRule = schema.rules[0]
  if (!requiredRule) {
    return
  }
  const { type, ...others } = rule || {}
  const newRule = Object.assign({}, requiredRule)
  if (type) {
    newRule.type = type
  } else {
    const requiredType = getRequiredRuleType(schema, WidgetSchema)
    if (requiredType) {
      newRule.type = requiredType
    }
  }
  schema.rules.splice(0, 1, Object.assign(newRule, others))
}

/**
 * 自定义必选规则校验结果
 * @param {object} rule
 * @param {string} type
 */
export function getRuleValidator (rule, type) {
  const { message, required } = rule
  const emptyValues = [null, undefined, '']
  return function (rule, value, callback) {
    rule.message = ''
    if (required) {
      if (isArray(value)) {
        if (value.length === 0) {
          return callback(new Error(message))
        }
      } else {
        if (include(emptyValues, value)) {
          return callback(new Error(message))
        }
      }
    }
    if (!include(emptyValues, value) && !checkValueType(value, type)) {
      return callback(new Error('类型不匹配'))
    }
    callback()
  }
}
