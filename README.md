# Epage

一款基于schema的可视化页面配置工具。可基于流行的前端组件库配置表单、页面等。


## 演示地址

- **[Demo](http://epage.didichuxing.com/examples/epage.html)**

## 安装

```sh
npm install epage -S
```

## 仓库更新说明

本仓库为`渲染器`核心依赖及`设计器`，更多`渲染器`及其他开源代码参见：[https://github.com/epage-team](https://github.com/epage-team)

## 设计器及渲染器示例

`npm` 方式引入

```js
import Epage from 'epage'
import 'epage/src/style/main.less'

const el = document.getElementById('root')
// 实例化设计器，Render为渲染器，widgets为待注册的页面部件
new Epage({ el, Render, widgets })
```

## 文档

关于`schema`定义、使用文档及开发者文档， [epage文档](http://epage.didichuxing.com/)

## License

[MIT](http://opensource.org/licenses/MIT)
