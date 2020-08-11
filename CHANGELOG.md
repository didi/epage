# Change Log

### 0.3.4（2020/08/10）

- [feat] : 增加`Context`及`Script`模块导出


### 0.3.3（2020/08/01）

- [feat] : 增加基础widget默认值
- [feat] : button组件支持自定义脚本

### 0.3.1~0.3.2（2020/07/22）

- [feat] : 增加页面配置属性，设置整体页面背景色、边距等
- [fix] : 修复基础widget 多选、级联、复选、单选等设计时，手动输入key自动失焦问题

### 0.3.0（2020/07/09）

- [feat] : 升级设计器主界面工具面板，分类展开方式呈现
- [feat] : 原工作面板内置的`form`及`validate`按钮删除，可在epage外自行实现
- [fix] : 删除设计器实例化时`getFormData`、`getSchema`参数。同时增加设计器内部渲染器示例的引用`epage.$render`，尤其在预览视图可以对渲染示例操作，如获取预览模式下用户输入的值`epage.$render.store.getFormData()`

**注意** `epage.$render.store`与`epage.store`不同，后者为设计器内部的渲染器示例的store，后者为设计器内部的store，二者在设计视图下是相同的


### 0.2.9（2020/07/02）

- [fix] : 工具方法增加 `usePlugins`方法，判断Vue项目plugin是否重复安装

### 0.2.8（2020/06/19）

- [fix] : 修复`helper`模块下`formatDate`格式时间HH未替换及转字符串未补0问题


### 0.2.7（2020/06/11）

- [feat] : `worker`支持`custom`类型脚本，不对结果进行校验
```js
const worker = new Epage.Worker()
const data = [1, 2]

worker.onmessage = function (e) {
  const { message, success, data } = e.data
  console.log(data)
  // [{ value: 1 }, { value: 2 }]
}
worker.postMessage({
  action: 'custom',
  data: data,
  fn: `return data.map(function(item){
    return { value: item }
    })`
})
```

### 0.2.6

- [fix] : 修复配置逻辑关系时，更改主控widget，受控widget不更新问题
- [feat] : 增加逻辑配置中 `Effect`及 `Properties` 类

### 0.2.5

- [fix] : 修复隐藏widget依然进行表单规则校验问题，增加`getFormRules`

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