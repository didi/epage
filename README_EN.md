# Epage

A schema-based visual page configuration tool. Forms, pages, etc. can be configured based on popular front-end component libraries.

English Introduction | [中文介绍](./README.md)

## Documents

Official website:  [http://epage.didichuxing.com](http://epage.didichuxing.com)

- [Quick Start](http://epage.didichuxing.com/usage/#快速起步)
- [Development Documentation](http://epage.didichuxing.com/developer/)
- [Epage API](http://epage.didichuxing.com/developer/epage.html)
- [How to develop widget?](http://epage.didichuxing.com/developer/widget.html)
- [Online Demos](http://epage.didichuxing.com/examples/)


## Demo

- **[Demo](http://epage.didichuxing.com/examples/epage.html)**

## Install

```sh
# install vue vuex iview@2 vuedragable in advance
npm install epage -S
# or yarn add epage
```

## Release
 
This repository is the core dependency of the designer and renderer. To view the change log, please visit [CHANGLOG](./CHANGELOG.md). For more renderer andd other open source code, see: [https://github.com/epage-team](https://github.com/epage-team)。

## Usage

```js
import Epage from 'epage'
import 'epage/src/style/main.less'

const el = document.getElementById('root')
// Instantiate Designer. Render is the renderer. widgets is the widget to be registered
// About Render and widgets can visit https://github.com/epage-team/epage-iview
new Epage({ el, Render, widgets })
```

## Design Concepts

Describing page functions, presentations, and interactions in a [schema](http://epage.didichuxing.com/developer/schema.html) way, generating the schema in a visual way and ultimately generating the expected page.

The project originated from the process form scenario. The custom development of each form is too costly and poorly maintainable. The most important thing is that the implementer wants to configure the generated form by visual means. Based on such a scenario, during the development process, we found that the form scenario is very similar to some other pages (such as list pages, detail pages, chart reports, etc.) from a certain perspective, and should be configured visually to reach the component Reuse, flexible configuration, easy maintenance, etc. Of course, in the process of using, we found that the complexity of the business is far from being covered by the basic components, so we need to have strong extensibility in order to customize the business components. Some projects even use different front-end frameworks
 
Earlier in the development of epage, we carried out the design based on the native dom node rendering, so that the designer and the renderer were separated to achieve multiple designs at one time. [How to develop widget?](http://epage.didichuxing.com/developer/widget.html)

## Communication Group

Wechat group

![](http://epage.didichuxing.com/static/epage-qrcode.jpeg)

## License

[MIT](http://opensource.org/licenses/MIT)
