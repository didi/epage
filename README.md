# Epage

一款基于schema的可视化页面配置工具。可基于流行的前端组件库配置表单、页面等。

[English Introduction](./README_EN.md) | 中文介绍

## 文档

官网：[http://epage.didichuxing.com](http://epage.didichuxing.com)

- [快速起步](http://epage.didichuxing.com/usage/#快速起步)
- [开发文档](http://epage.didichuxing.com/developer/)
- [设计器API](http://epage.didichuxing.com/developer/epage.html)
- [如何开发widget?](http://epage.didichuxing.com/developer/widget.html)
- [在线示例](http://epage.didichuxing.com/examples/)


## 演示地址

- **[Demo](http://epage.didichuxing.com/examples/epage.html)**

## 安装

```sh
// 需提前安装vue vuex iview@2 vuedragable
npm install epage -S
```

## 仓库更新说明

本仓库为`渲染器`核心依赖及`设计器`，更新日志查看[CHANGLOG](./CHANGELOG.md)。更多`渲染器`及其他开源代码参见：[https://github.com/epage-team](https://github.com/epage-team)。

## 设计器及渲染器示例

```js
import Epage from 'epage'
import 'epage/src/style/main.less'

const el = document.getElementById('root')
// 实例化设计器，Render为渲染器，widgets为待注册的页面部件
// 关于 Render 和 widgets，可以访问 https://github.com/epage-team/epage-iview
new Epage({ el, Render, widgets })
```

## 设计理念

通过schema方式描述页面功能、展示及交互，以可视化方式操作生成schema最终生成预期的页面。

项目起源于流程表单场景，定制开发每一个表单成本太高且维护性差，最主要是实施人员希望通过可视化方式配置生成表单。基于这样的场景，在开发过程中我们发现，表单场景与其他一些页面（如列表页、详情页、图表报表等）场景从某种角度看非常相似，都应该可以通过可视化配置出来，达到组件复用、灵活配置、方便维护等效果。当然在使用过程中，我们发现业务的复杂远不是基础组件能覆盖的，于是要求需要具备很强的扩展性，以便定制业务组件，有些项目甚至还使用了不同前端框架。

开发epage时，就进行了基于原生dom节点渲染的设计，使得设计器及渲染器分离，实现一次设计多处渲染。关于如何定制开发widget可以访问 [如何开发widget?](http://epage.didichuxing.com/developer/widget.html)

## 交流群

微信群

![](./public/imgs/epage-qrcode.jpg)

## License

[MIT](http://opensource.org/licenses/MIT)
