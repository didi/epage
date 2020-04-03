<template lang="pug">
setting-form(:store='store' :setting='setting')
  data-source(:store='store' @success='onSuccess' @tree-data:append="onAddTreeOpton")
    //- Row(slot="dynamic")
      Col(span="12")
        FormItem
          span(slot='label') value
            field-tip(content='级联组件中value对应的字段，默认为value')
          Input(v-model="selectedSchema.option.valueAlias" size="small" placeholder="value")
      Col(span="12")
        FormItem
          span(slot='label') label
            field-tip(content='级联组件中label对应的字段，默认为label')
          Input(v-model="selectedSchema.option.labelAlias" size="small" placeholder="label")
      Col(span="16")
        FormItem
          span(slot='label') children
            field-tip(content='级联组件中children对应的字段，默认为children')
          Input(v-model="selectedSchema.option.childrenAlias" size="small" placeholder="children")
    template(slot="tree")
      Modal(v-model="showModal" width="650" :closable="false")
        .ep-widget-cascader-modal(v-if="showModal")
          data-tree(:raw-data= "treeData" :schema-type="selectedSchema.type")
          .ep-widget-cascader-modal-msg 注意key值与数据源类型是否一致
        template(slot="footer")
          Button(type="default" @click="onTreeCancel" style="marginRight: 10px;") 取消
          Button(type="primary" @click="onTreeOk") 确定

  FormItem(label='分隔符')
    Input(v-model="selectedSchema.option.delimiter" placeholder="展示模式下默认为'/'" size="small" style="width: 100px")
</template>
<script>
import settingExtend from '../../extends/setting'
import { jsonClone, randomStr, include } from '../../../helper'
import DataSource from '../../components/data-source'
import FieldTip from '../../components/field-tip'
import DataTree from './data-tree.vue'

export default {
  components: { DataSource, DataTree, FieldTip },
  extends: settingExtend,
  data () {
    return {
      showModal: false,
      treeData: []
    }
  },
  methods: {
    /**
     * 成功获取到动态数据
     */
    onSuccess (dynamicData) {
      const key = this.selectedSchema.key
      this.store.updateWidgetOption(key, { dynamicData })
    },
    /**
     * 添加选项
     */
    onAddTreeOpton () {
      this.treeData = jsonClone(this.selectedSchema.option.data)
      if (this.treeData.length === 0) {
        const randomValue = randomStr(7)
        this.treeData.push({
          key: randomValue,
          value: randomValue,
          expand: true
        })
      }
      this.showModal = true
    },
    /**
     * 取消数据编辑
     */
    onTreeCancel () {
      this.showModal = false
      this.treeData = []
    },
    /**
     * 确定数据
     */
    onTreeOk () {
      if (!this.validateTreeData()) {
        return this.$Message.error('请将数据填写完整~')
      }
      const { key } = this.selectedSchema
      const treeData = this.deleteExtraProperty(this.treeData)
      this.store.updateWidgetOption(key, { data: treeData })
      this.$emit('on-option-add')
      this.onTreeCancel()
    },
    validateTreeData (data) {
      let result = true
      // value 的类型string or number
      function validate (data) {
        for (const item of data) {
          if (!(item.key && (item.value || item.value === 0))) {
            result = false
            return
          } else {
            if (Array.isArray(item.children)) {
              validate(item.children)
            }
          }
        }
      }
      validate(this.treeData)
      return result
    },
    deleteExtraProperty (data) {
      const propertys = ['value', 'key']
      const recursionProps = ['children']
      function recursion (data) {
        const result = []
        for (const item of data) {
          const itemObj = {}
          for (const key in item) {
            const itemVal = item[key]
            if (include(propertys, key)) {
              itemObj[key] = itemVal
            }
            if (include(recursionProps, key)) {
              itemObj[key] = Array.isArray(itemVal) ? recursion(itemVal) : itemVal
            }
          }
          result.push(itemObj)
        }
        return result
      }
      return recursion(data)
    }
  }
}
</script>
