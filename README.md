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

此库提供设计器界面及基本交互，是pc端设计器核心依赖，移动端渲染器可以不依赖此库。widget能力及工具面板内容需配合渲染器一起使用，如[epage-iview](https://github.com/epage-team/epage-iview)，用户最终使用仅使用渲染器包即可。

开发移动端渲染的话可以直接引入[epage-core](https://github.com/epage-team/epage-core)即可（因为仅完成渲染功能即可，不需要拖动配置界面）。

开发自定义widget推荐通过脚手架 [epage-cli](https://github.com/epage-team/epage-cli) 方式创建

```sh
# 全局安装
npm i -g epage-cli
# 初始化项目
epage init myWidgets
cd myWidgets
# 启动
npm start
```

```sh
# 需提前安装vue vuex iview vuedraggable
npm install epage -S
# 或者 yarn add epage
```

## 仓库更新说明

本仓库为`Epage渲染器`及`Epage设计器`核心依赖，更新日志查看[CHANGLOG](./CHANGELOG.md)。

更多`Epage渲染器`及相关工具参见：[https://github.com/epage-team](https://github.com/epage-team)。

## 设计器及渲染器示例

```js
import widgets, { Epage, Render } from 'epage-iview'
import 'epage-iview/src/style/main.less'

const el = document.getElementById('root')
// 实例化设计器，Render为渲染器，widgets为待注册的页面部件
// 关于 Render 和 widgets，可以访问 https://github.com/epage-team/epage-iview
new Epage({ el, Render, widgets })
```

**epage-iview** 为基于 **iview** 组件库的 epage 渲染器实现

## 设计理念

通过[schema](http://epage.didichuxing.com/developer/schema.html)方式描述页面功能、展示及交互，以可视化方式配置生成schema，最终生成页面。

项目起源于流程表单场景，定制开发每一个表单成本太高且维护性差，最主要是实施人员希望通过可视化方式配置生成表单。基于此场景，在开发中我们发现，表单场景与其他一些页面（如列表页、详情页、图表报表等）场景非常相似，都应该可以通过可视化方式配置出来，从而达到组件复用、灵活配置、方便维护等效果。在使用过程中，业务的复杂远不是基础组件能覆盖的，于是要求需要具备很强的扩展性，以便定制业务组件，有些项目甚至还使用了不同前端框架。

[epage](http://epage.didichuxing.com/)的设计器及渲染器分别基于原生dom节点设计，使得设计器及渲染器分离，结合统一的[schema](http://epage.didichuxing.com/developer/schema.html)规范，实现一次设计多处渲染。关于如何定制开发widget可以访问 [如何开发widget?](http://epage.didichuxing.com/developer/widget.html)

## 交流群

QQ群

<img src="https://img-hxy021.didistatic.com/static/star/epage-qrcode-qq.png" width="250">

## License

[MIT](http://opensource.org/licenses/MIT)
