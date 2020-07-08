const text = {
  adapter: `
使用自定义脚本或使用内置工具函数util.convert2kv如：
/*
 data 接口响应值
 function 数据转换逻辑
 childrenAlias 代表是否需要递归调用和children字段的别名，如果字段本身就是children也要加上这个参数
*/
return util.convert2kv(data, function (item) {
  return {
      key: item.valueAlias,
      value: item.labelAlias
  }
}, 'childrenAlias')
`,
  url: `
支持查询参数如：
http://test.com/$$field01?page=$$field02
field01为当前表单 唯一标识
$$field01 为字段 field01 的值
`
}

function textToRich (text, rich) {
  for (const i in text) {
    const tipArray = text[i].split(/\n/)
    rich[i] = tipArray.map(tip => `<p>${tip}</p>`).join('')
  }
}
const richText = {}
textToRich(text, richText)

export default richText
