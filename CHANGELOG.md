# Change Log

### 0.2.0

- [feat] : 导出增加`schema`，移除原导出`Schema`，同时`schema`模块中提供多种基础`Schema`可供继承

```js
schema.BaseSchema // 基础Schema，所有Schema都将继承，只包含schema必须字段
schema.FormSchema // 针对表单提供的特定场景Schema，
schema.RootSchema // 根Schema，继承至grid widget的Schema
```
注意：

原通过`Epage.Schema`方式继承需改为 `Epage.schema.BaseSchema` 或 `Epage.schema.FormSchema`

- [feat] : 替换 `schema.title` 为 `schema.label`
- [fix] : 修改`switch` schema的默认规则

### 0.1.0

- [feat] : 正式开源第一版