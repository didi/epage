import Schema from '../widget/base/grid/Schema'

/**
 * root schema
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
    // global setting for label
    this.label = {
      width: 80,
      position: 'right',
      colon: false
    }
    this.style = {
      maxWidth: 1600
    }

    this.create(props)
    this.createChildren(props)
  }
}
