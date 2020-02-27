<template>
  <Tree
    class="ep-data-tree-wrapper"
    :data="rootList"
    :render="renderContent"
  />
</template>
<script>
import { randomStr, isNumberString, include } from '../../../helper'

export default {
  props: {
    rawData: {
      type: Array,
      required: true
    },
    schemaType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      rootList: [
        {
          value: '本地数据',
          expand: true,
          render: (h, { root, node, data }) => {
            return <div class="leaf-root">
              <span>
                <span>{data.value}</span>
              </span>
              <span class="btn">
                <i-button icon="ios-plus-empty" type="primary" size="small" style={{ width: '52px' }} onClick={_ => this.append(data)}></i-button>
              </span>
            </div>
          },
          children: []
        }
      ],
      buttonProps: {
        type: 'ghost',
        size: 'small'
      }
    }
  },
  mounted () {
    const arrow = document.querySelectorAll('.tree-wrapper .ivu-tree-children .ivu-tree-arrow')
    if (arrow && arrow[0]) {
      arrow[0].style.display = 'none'
    }
    this.rootList[0].children = this.rawData
  },
  methods: {
    renderContent (h, { root, node, data }) {
      const list = [
        { key: 'value', placeholder: '请输入value', tips: '显示字段' },
        { key: 'key', placeholder: '请输入key', tips: '提交字段' }
      ]
      return (
        <div class="leaf-item">
          <div class="leaf-content_wrapper">
            {list.map(item => {
              return (
                <div>
                  <span class="mr5">
                    {item.key}
                    <Tooltip content={item.tips} placement='top' transfer={true}>
                      <Icon type='ios-information-outline'></Icon>
                    </Tooltip>
                  </span>
                  {/* elsint-disable-next-line */}
                  <i-input
                    value={data[item.key]}
                    size="small"
                    onInput={value => { data[item.key] = value.trim() }}
                    placeholder={item.placeholder}
                    class={{
                      'leaf-content_wrapper-input': true,
                      'ivu-form-item-error': item.key === 'value' && this.checkKeyType(data[item.key])
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div class="leaf-operat_wrapper">
            <i-button class="mr5" icon="ios-plus-empty" type="ghost" size="small" onClick={_ => this.append(data)}></i-button>
            <i-button icon="ios-minus-empty" type="ghost" size="small" onClick={_ => this.remove(root, node, data)}></i-button>
          </div>
        </div>
      )
    },
    append (data) {
      const children = data.children || []
      const randomValue = randomStr(7)
      const defaultValue = {
        value: randomValue,
        key: randomValue,
        expand: true
      }
      children.push(defaultValue)
      !data.children && this.$set(data, 'children', children)
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    },
    // 校验其他类型是否能成功转 number 类型
    checkKeyType (key) {
      const schemaType = this.schemaType
      // schema.type 中可选的 number 类型
      const numberTypes = ['number', 'array<number>']

      return include(numberTypes, schemaType) && !isNumberString(key)
    }
  }
}
</script>
