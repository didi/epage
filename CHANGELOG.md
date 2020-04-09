# Change Log


### 0.2.4

- [fix] : 修改上传widget 的默认校验规则
- [fix] : 修改基础非表单Schema默认静态属性，去除`validators`和`type`
- [fix] : 修改打包脚本由`npm run prod`改为`npm run build`

### 0.2.3

- [fix] : 修复datePicker schema定义，去除`option.type`
- [fix] : 修复timePicker 设置表单时间点及区间切换错误
- [fix] : 修复cascader连接符不生效问题，优化手动输入数据时样式
- [fix] : 修复inputNumber设置表单步长及精度最小值不准确问题

### 0.2.2

- [fix] : 修复基础widget的Schema默认字段，去除冗余字段，修改默认
- [fix] : 更新 package.json 增加 `peerDependencies` 字段

### 0.2.1

- [fix] : 修复逻辑面板主控、被控widget显示名不正确
- [fix] : 修复无`schema.type`值时，获取`store.getFormData()`报错

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