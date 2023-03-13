# babel-plugin-import

早期（没有 tree shaking 的时代）为了实现按需引入功能，我们会通过 babel-plugin-import 来优化我们的项目打包体积，做到只打包我们项目中所用到的模块。
但在现在新版的 antd 和 material-ui 中，默认已支持基于 ES modules 的 tree shaking 功能；而打包工具如：Webpack、Rollup 等在打包层面也支持了 tree shaking，使得我们不需要额外配置 babel-plugin-import 也能实现按需引入，这得益于 tree shaking。
虽然现代框架技术都已支持 tree shaking，但总归在一些老的项目所用到的老技术是无法支持 tree shaking 的，这就需要本文的主角 babel-plugin-import 来完成这件事情。

## 这里使用 lodash 测试该插件的用法

首先在代码中引用 lodash 的 pick 方法`import { pick } from 'lodash'`,在.babelrc 中添加此 plugin

```json
"plugins": [
    [
        "import",
        {
            "libraryName": "lodash"
        }
    ]
]
```

运行`yarn build`，发现控制台中有报错，

> Can't resolve 'lodash/lib/pick'

说明解析 lodash 路径时，找到 lodash 的 lib 目录中，并不是预想的行为，查阅 api 后，该插件会默认在包的 package.json 的同级目录 lib 中查找引用的源码，这是支持配置的。查看我们安装的 lodash 包中 pick 方法的路径，发现真实引用路径在 package 的同级目录下。所以我们设置该选项：

```json
"plugins": [
    [
        "import",
        {
            "libraryName": "lodash",
            "libraryDirectory": "."
        }
    ]
]
```

再次运行 yarn build，编译成功。

查看 dist/main.js 文件，查看是否 lodash 被全量打入包中，并没有。

相反我们将插件设置去掉，查看是否打入 lodash 全量包。很明显，虽然我们真实只使用到了 pick 方法，但是 webpack 却将 lodash 全量包打入包中，这无疑增加了包的体积。
