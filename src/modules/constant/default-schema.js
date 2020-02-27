/**
 * 生成默认schema对象
 */
export default () => ({
  key: '',
  type: 'object',
  widget: '',
  size: 'default',
  container: false,
  mode: '',
  option: {},
  children: [],
  logics: [],
  label: {
    width: 80,
    // right | left | top
    position: 'right',
    // label 后是否自动加冒号
    colon: false
  }
})
