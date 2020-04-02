import { BaseSchema } from '../../../schema'

export default class SubTableSchema extends BaseSchema {
  constructor (props) {
    super()
    this.label = '表格'
    this.option = {
      type: 'static',
      columns: [{
        type: 'index',
        title: 'No',
        key: '',
        align: 'left'
      }],
      page: {
        total: 0,
        current: 1,
        size: 10,
        showTotal: true,
        position: 'left'
      },
      data: [],
      dynamicData: [],
      noDataText: '暂无内容'
    }
    this.create(props)
  }
}

// 静态配置，同类widget公有
Object.assign(SubTableSchema, {
  title: '子表',
  widget: 'subTable',
  icon: 'ios-grid-view',
  type: 'array',
  // validators: [],
  logic: {
    value: [],
    event: []
  }
})
