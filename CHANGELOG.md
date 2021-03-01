# Change Log

### 0.7.2（2021/3/1）

- [feat] : 设计器支持`tool`、`setting`面板自定义
```js
new Epage({
  panels: {
    tool: false, // 隐藏工具面板，以下自定义
    // tool: {
    //   render: function ({ el, store,  ctx}) {
    //     el.innerHTML ='tool'
    //   },
    //   style: ''
    // },
    setting: false,  // 隐藏配置面板，以下自定义
    // setting: {
    //   render: function ({ el, store,  ctx}) {
    //     el.innerHTML ='tool'
    //   },
    //   style: ''
    // },
    // ...
  }
})
```

### 0.7.1（2021/2/21）

- [fix] : 更新`epage-core@0.5.1`

### 0.7.0（2021/2/20）

- [feat] : 设计器界面升级
  - 增加`header`面板，分`left`、`center`、`right`三部分
  - `logic`、`preview`、`schema`视图改外全屏方式
  - 增加`pc`、`h5`双端同时配置能力
- [feat] : 设计器支持**插件**、**面板**定制能力

```js
import { render } from 'epage-core'
import iviewWidgets, { entry as PCEntry } from 'epage-iview'
import vantWidgets, { entry as H5Entry } from 'epage-vant'

class EpageCustomPlugin {
  apply(hooks, epage) {
    // 生命周期参考下方 生命周期钩子 说明
    hooks.life.beforeCreate.tap(function ({ ctx })  {
      console.log(11, ctx)
    })
     // hooks.life及hooks.schema的钩子，ctx为设计器实例
     // hooks.render的钩子，ctx为渲染器实例
  }
}

const config = {
  // 必填
  el,
  // 非必填
  schema,
  // 旧用法，未来会替换，不止双端设计器，建议使用新用法
  widgets: iviewWidgets,
  // 旧用法，未来会替换，不止双端设计器，建议使用新用法
  Render: render.VueRender,
  // 下方均为新用法
  view: 'pc', // 非必填，默认pc，设计器默认渲染视图
  // 新用法中pc 与h5其一必填，或两个都有
  pc: {
    widgets: iviewWidgets,
    component: PCEntry, // 渲染入口
    Render: render.VueRender
  },
  h5: {
    widgets: vantWidgets,
    component: H5Entry, // 渲染入口
    Render: render.VueRender
  },
  // 非必填，全局扩展配置面板：所有widget都会有此配置
  // 一般替换或增强内置全局配置，只要没志向key 为
  // prop | style | global 即可替换内置
  // 属性 | 样式 | 页面配置
  // 用法与下方 `widget.Setting` 椅子
  settings: [{
    key: 'prop',
    name: '自定义属性',
    // 用此属性将使用内置渲染器，
    // framework: 'vue',
    component: function ({ el, store }) {},
  }],
  // 非必填，定制面板
  panels: {
    header: {
      // 有render属性，left、center、right属性失效
      // style属性继续生效
      render: function({ el, store }) {
        el.innerHTML = 'Epage Header'
      },
      // 非必填
      style: 'font-size: 20px;',
      // 左侧标题
      left: {
        render: function({ el, store }) {
          el.innerHTML = 'Epage Title'
        },
        style: 'font-size: 20px;',
      },
      center, // 同 left
      right: {
        logic: false,
        schema: false,
        preview: false,
        help: false,
        style, // 同 left
        render, // 同 left
      }
    }
  },
  // 非必填
  plugins: [
    new EpageCustomPlugin()
  ]
}

new Epage(config)
```

- [feat] : 设计器增加**生命周期钩子**
```js
{
  // 设计器生命周期
  life: {
    init, // 初始化，store、render等尚未进行
    beforeCreate, // 设计器创建之前，可获取store
    created, // 设计器创建之后，可获取内部渲染器$render
    beforeDestroy, // 设计器销毁前
    destroyed // 设计器销毁后，注销事件等
  },
  // schema 相关hook
  schema: {
    copy, // schema执行copy时调用，复制到剪切板以前对schema做自定义修改
  },
  // 同设计器生命周期，只是针对内置渲染器
  render: {
    init,
    beforeCreate,
    created,
    beforeDestroy,
    destroyed,
  }
}
```

- [feat] : 单个`widget.Setting`支持数组形式，并保留原来单一`vue`组件能力
```js
// widget/Setting.js
// 原来单个vue组件也支持，也可以为下方数组形式
export default [{
  // 必填参数，其中prop | style | global为内置设置面板key
  // 为这三个值将替换对应内置配置表单，否则将在此基础扩展面板
  key: 'prop', 
  // 面板标题
  name: '自定义属性',
  // 可选参数，如果值为vue或react，将使用epage-core的render模块
  // 的 VueRender或ReactRender渲染，下方component属性值
  // 应为对应框架的组件
  fragment: 'vue',
  // 不指定 fragment字段，且component为函数，将执行component
  // 参数 { el, store } 
  // el为当前配置面板内dom容器
  // store为当前设计器store，可获取、修改设计器内所有状态
  component: funtion ({ el, store }) {
    el.innerHTML = '自定义配置'
    // 这里可通过 new ReactRender({ el, store, component })
    // 实现react组件的配置表单能力
  }
}]
```

⚠️⚠️⚠️ **不兼容更新** ⚠️⚠️⚠️

- `src/Design.js`重命名为 `src/Epage.js`
- 原内置widget的 `Setting.vue`，移动到`epage-iview`包中
- 去掉 `widget` 模块导出，响应能力如下改动：
  - `Epage.widget.input.Setting`等`Setting`表单 改为 `epage-iview`包的`inputWidget.Setting`
  - `Epage.setting`对应`epage-iview`包的`setting`模块
- 原从`epage-iview`包内引入的样式，做如下修改：

```less
/* 原epage-iview项目，直接依赖epage */
@import '~iview/src/styles/index.less';
@import '~epage/src/style/main.less';

/* 修改后，epage-iview与epage相互独立 */
@import '~iview/src/styles/index.less';
@import '~vant/lib/index.less'; /* 双端设计才需要 */
@import '.~epage/src/style/main.less';
@import '~epage-iview/src/style/main.less';
@import '~epage-vant/src/style/main.less'; /* 双端设计才需要 */
```

- 原`epage-iview`（**渲染组件** + **渲染器**）直接依赖`epage`（设计器），改造后`epage-iview`（渲染组件）与`epage`相互独立，**渲染器** 移动到`epage-core`的render模块（`EpageCore.render.VueRender`）

### 0.6.1（2021/1/18）

- [fix] : 修复widget被二次添加时，widget.Setting生命周期没有再次使用问题

### 0.6.0（2020/12/31）

- [feat] : 开放单一widget样式配置，自定义高级背景配置
- [feat] : 新增`text` widget能力，支持`{{$f[schema.name]]}}`表达式运算

### 0.5.0（2020/11/04）

- [feat] : 增加整体页面配置(背景色、间距等)
- [feat] : 配置面板支持自定义扩展，通过`new Epage`扩展参数

```js
const settings = [
  { key: 'style', title: '样式设置', component: VueComponent }
]
new Epage({..., settings })
```

- [feat] : 工具面板界面优化
- [fix] : 字典能力优化（暂不可见）


### 0.4.1（2020/10/20）

- [feat] : 逻辑关系中，被控组件存在多值时，增加值的 `或`、`且` 关系
- [feat] : 逻辑关系比较增加值类型条件
- [feat] : 去除工具面板图标，以通用
- [fix] : 修复 `cascader` 值类型转换未递归问题


### 0.4.0（2020/10/12）

- [feat] : 增加widget显隐属性默认值，逻辑配置面板，不符合条件时回退到默认值
- [feat] : 逻辑配置面板，可配置自定义脚本，可直接使用ctx全局变量，关于ctx可参考button的[ctx](http://epage.didichuxing.com/examples/widgets/button.html#schema-option%E5%AE%9A%E4%B9%89)

### 0.3.8（2020/08/19）

- [fix] : 修复`datePicker`、`timePicker`在设计器中，默认值为*使用时日期*时，切换其他组件默认值被修改问题

### 0.3.7（2020/08/18）

- [fix] : 修复上个版本增加`json`类型忽略`undefined`情况导致渲染报错

### 0.3.6（2020/08/17）

- [feat] : 增加`json`表单类型校验

### 0.3.5（2020/08/13）

- [fix] : 修复从设计器实例页跳转到其他页，重新返回设计器页预览视图未显示问题

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
