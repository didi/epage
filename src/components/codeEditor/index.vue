<template lang="pug">
.ep-codeeditor
  input(type='textarea' ref='textarea' v-model='mode')
</template>
<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/cobalt.css'
import 'codemirror/mode/javascript/javascript.js'

export default {
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: {
      type: String,
      default: ''
    },
    // 外部传入的语法类型
    language: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      // 内部真实的内容
      code: '',
      // 默认的语法类型
      mode: 'javascript',
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        theme: 'cobalt',
        // 显示行号
        lineNumbers: true,
        line: true
      }
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
    }
  },
  mounted () {
    // 初始化
    this._initialize()
  },
  methods: {
    // 初始化
    _initialize () {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
      // 编辑器赋值
      this.coder.setValue(this.value || this.code)

      // 支持双向绑定
      this.coder.on('change', (coder) => {
        this.code = coder.getValue()

        if (this.$emit) {
          this.$emit('input', this.code)
        }
      })

      // 尝试从父容器获取语法类型
      if (this.language) {
        // 获取具体的语法类型对象
        const modeObj = this._getLanguage(this.language)

        // 判断父容器传入的语法是否被支持
        if (modeObj) {
          this.mode = modeObj.label
        }
      }
    },
    // 获取当前语法类型
    _getLanguage (language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find((mode) => {
        // 所有的值都忽略大小写，方便比较
        const currentLanguage = language.toLowerCase()
        const currentLabel = mode.label.toLowerCase()
        const currentValue = mode.value.toLowerCase()

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return currentLabel === currentLanguage || currentValue === currentLanguage
      })
    },
    // 更改模式
    changeMode (val) {
      // 修改编辑器的语法配置
      this.coder.setOption('mode', `text/${val}`)

      // 获取修改后的语法
      const label = this._getLanguage(val).label.toLowerCase()

      // 允许父容器通过以下函数监听当前的语法值
      this.$emit('language-change', label)
    }
  }
}
</script>
