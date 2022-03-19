# 主题、换肤

## 目前 oss 用的方案

### 关于 less

modifyVars 方法

less 是一种 css 预处理器，支持变量、mixins、函数等功能。额外的 less 提供了一个`less.js`文件。
引入该文件后会在全局定义一个全局变量`less`。如图:![](./img/less.png).其中有一个方法`modifyVars`。测试 demo:`./less/modifyVars/indx.html`,点击第一个 div 时，第二个 div 的 color 切换册成功。调试发现，页面初始化后，在 head 标签中除了 link 标签引入 less 文件外，还有一个 style 标签，该标签内容是 color.less 的内容将 less 变量替换后的真实内容，当点击事件触发后，函数的传参意味着将 less 的变量成 yellow，此时观察 style 标签中的代替颜色的变量，被替换成了 yellow。总结猜想过程是在引入 less.js 文件后，该文件会遍历 head 标签中的 link 引入的 less 文件，然后解析 less 文件内容，把用到 less 变量的地方都替换成真实的值,生成真实 css 的内容之后在 head 中插入一个新的 style 标签,样式生效。当做点击操作时，会再做一遍这个流程从而达到动态切换主题功能。

**less-loader 中的 modifyVars 方法使用：**
在 webpack 中的 module.rules 中配置使用 less-loader 处理 less 文件时，可支持传入如下配置

```js
{
    loader: require.resolve('less-loader'),
    options: {
        sourceMap: true,
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                '@default-color': 'red',
            },
        },
    },
},
```

这里的 modifyVars 作用是在处理 less 文件时，当遇到在其中定义过的变量时（key），将该变量的替换成这里的 value。在 antd 文档中，这个方案被官方推荐定制一个主题，也就是在写代码时，将一整套用到的统一颜色抽象成一套变量名和真实值的一组映射，代码只用该变量代替颜色就可以。然后用 webpack 打包时，统一替换变量为真实色值。这里的一组映射就是一套主题.

**关于支持运行时切换主题方案**

首先是`antd-theme-webpack-plugin`,此插件依赖了`antd-theme-generator`npm 包，查看该包教程后，该包的作用就是最终结果生成一个 less 文件，该 less 文件包含了所有传入样式文件的内容和 less 变量的定义（类似`./less/modifyVars/indx.html`中的 less 文件）。该包支持配置 antd 在 node_module 中的路径、包含所有 less 样式文件的总目录、所有的 less 变量定义文件，拿到这些配置最终生成一个 less 文件。然后回到`antd-theme-webpack-plugin`，按照上述 less.js 文件作用的过程，现在有了 less 文件，剩下的就是动态的 modifyVars，该包相比`antd-theme-generator`包多了 html 入口目录地址和 publicPath，查看源码看出，该插件就是利用上个包生成的 color.less 文件，然后将

```js
<link rel="stylesheet/less" type="text/css" href="${this.options.publicPath}/color.less" />
<script>
window.less = {
    async: false,
    env: 'production'
};
</script>
<script type="text/javascript" src="${this.options.lessUrl}"></script>
```

插入到 html 文件的 head 标签中，然后在切换 js 代码中切换主题时，就可以使用`window.less.modifyVars(variables{})`切换主题了。这里的 variables 就是目标主题下的 less 变量的集合。调用之后的结果就是上述的在 head 标签下插入一个将所有 color.less 文件内容的变量全都替换后的 style 标签，以达到覆盖样式的功能。

**总结**：总结项目中的用到的切换主题功能全流程：首先子应用打包时，先启用 less-loader 打包时替换掉使用到的 less 变量，这是为了打包时，统一替换想要的默认主题色，然后使用`ant-theme-webpack-plugin`插件，收集所有的 less 文件中用到所有预定义变量的样式生成 color.less 文件，并且注入 less.js，页面第一次打开时就是默认的主题。嵌入主应用后，相关的 webpack 配置在主应用也有一份，现在替换主题都是通过主应用来切换，主应用中也是调用 less.modifyVars 来切换。主、微应用共用的是同一套 less 变量集，切换时相当于主、微应用都切换到目标主题。
