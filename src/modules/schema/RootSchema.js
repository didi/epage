import Schema from '../widget/base/grid/Schema'

/**
 * widget schema 基础类
 */
export default class RootSchema extends Schema {
  constructor (props) {
    super()
    this.title = ''
    this.description = ''
    this.size = 'default'
    this.container = true
    this.children = [{
      span: 24,
      list: []
    }]
    this.logics = []
    this.label = {
      width: 80,
      position: 'right',
      colon: false
    }
    // 实现基础类Schema也可以根据schema实例化
    this.create(props)
    this.createChildren(props)
  }
}
