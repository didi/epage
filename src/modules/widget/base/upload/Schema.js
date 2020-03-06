import Schema from '../../../../modules/schema'

export default class UploadSchema extends Schema {
  constructor (props) {
    super()
    this.title = '上传'
    this.placeholder = '请选择文件'
    this.option = {
      // 上传的地址，必填
      action: '',
      // 匹配上传接口返回的数据格式
      adapter: 'return { name: data.filename, url:data.url }',
      // 支持的文件类型，与 accept 不同的是，format 是识别文件的后缀名
      // accept 为 input 标签原生的 accept 属性，会在选择文件时过滤
      // 可以两者结合使用
      format: [],
      // 接受上传的文件类型
      accept: '',
      // 上传控件的类型，可选值为 select（点击选择），drag（支持拖拽）
      type: 'select',
      // 是否支持多选文件
      multiple: true,
      // 文件大小限制，单位 kb
      maxSize: 5000,
      // 是否显示已上传文件列表
      showUploadList: true,
      // 设置上传的请求头部
      headers: [],
      // 上传的文件字段名
      name: 'file',
      // 支持发送 cookie 凭证信息
      withCredentials: false,
      // 上传时附带的额外参数
      data: {}
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
