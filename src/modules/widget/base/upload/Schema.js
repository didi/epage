import Schema from '../../../../modules/schema'

export default class UploadSchema extends Schema {
  constructor (props) {
    super()
    this.title = '上传'
    this.placeholder = '请选择文件'
    this.option = {
      action: '', // 上传的地址，必填
      adapter: 'return {name:data.name,url:data.url}', // 匹配上传接口返回的数据格式
      format: [], // 支持的文件类型，与 accept 不同的是，format 是识别文件的后缀名，accept 为 input 标签原生的 accept 属性，会在选择文件时过滤，可以两者结合使用
      accept: '', // 接受上传的文件类型
      type: 'select', // 上传控件的类型，可选值为 select（点击选择），drag（支持拖拽）
      multiple: true, // 是否支持多选文件
      maxSize: 5000, // 文件大小限制，单位 kb
      showUploadList: true, // 是否显示已上传文件列表
      headers: [], // 设置上传的请求头部
      name: 'file', // 上传的文件字段名
      withCredentials: false, // 支持发送 cookie 凭证信息
      data: {} // 上传时附带的额外参数
    }
    this.$init(props)
  }
}

// 静态配置，同类widget公有
Object.assign(UploadSchema, {
  title: '上传',
  widget: 'upload',
  icon: 'ios-cloud-upload-outline',
  type: 'array',
  validators: [],
  logic: {
    value: [],
    // event: ['change']
    event: []
  }
})
