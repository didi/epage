export default {
  /**
   * 当前widget全局唯一key，自动生成
   * @type {String}
   */
  key: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * 当前widget 表单字段名，默认与key相同，可修改
   */
  name: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * 当前widget，每个widget值必须唯一
   */
  widget: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * widget值类型
   */
  type: {
    type: String,
    default: 'string',
    optional: ['string', 'number', 'boolean', 'array', 'object']
  },

  /**
   * widget 名称，一般用于label文本显示
   */
  title: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * widget 描述，一般widget下方显示
   */
  description: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * widget 帮助提示，一般显示为label文本右侧叹号图标
   */
  help: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * widget值是否隐藏
   */
  hidden: {
    type: Boolean,
    default: false,
    optional: [true, false]
  },

  /**
   * widget是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
    optional: [true, false]
  },

  /**
   * widget值占位符内容
   */
  placeholder: {
    type: String,
    default: '',
    optional: null
  },

  /**
   * 是否为容器widget，如果为 true，则type字段将不再生效，缺省object
   */
  container: {
    type: Boolean,
    default: false,
    optional: [true, false]
  },

  /**
   * widget 大小
   */
  size: {
    type: String,
    default: 'default',
    optional: null // small default large
  },

  /**
   * 是否动态可动态添加，动态添加将使表单值变成数组方式
   */
  // dynamic: {
  //   type: Boolean,
  //   default: false,
  //   optional: null // small default large
  // },

  /**
   * widget校验规则，请参考
   * [async-validator](https://github.com/yiminghe/async-validator)
   * @type {Array<Object>}
   */
  rules: {
    type: Array,
    default: () => ([{ required: false, message: '必填', type: 'string', trigger: 'blur' }]),
    optional: null
  },

  /**
   * 当前widget自定义属性放在此处，区别于option同级的其他属性（所有widget生效）
   */
  option: {
    type: Object,
    default: () => ({}),
    optional: null
  },

  // /**
  //  * 当前widget 自定义label属性，不设置默认继承根 schema
  //  */
  // label: {
  //   type: Object,
  //   default: () => ({
  //     width: 80,
  //     position: 'right',
  //     colon: false
  //   }),
  //   optional: null
  // },

  /**
   * 但this.container = true时，this.children必须为数组，其数据元素格式为：
   * @type {Array<Object{span<Int>, list<Array>}>}
   * Example:
   * {
   *   list: [], // 子元素为schema
   *   span: 12  // 采用栅格布局，通栏为24栅格，
   * }
   */
  children: {
    type: Array,
    default: () => ([]),
    optional: null
  },
  /**
   * 支持使用者动态添加组件
   */
  list: {
    type: Array,
    default: () => ([]),
    optional: null
  }
}
