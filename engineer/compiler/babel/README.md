# Babel

js 编译器。主要用来将 ES6+代码转换为向后兼容的代码，以适配旧版的 js 和浏览器版本。

它主要做几件事

- 转换语法
- 模拟代码中用到的新语法但是目标环境中并没有该功能的写法
- 源码转换??

在 7 版本之后，所有 babel 相关的包都以 npm 包的形式发布在@babel 命名空间下

## 概念

## 插件

基于插件形式的（pluggable），转换代码的功能都是基于插件实现的，想要转换一个未知的语法代码，就需要添加一个转换该语法的插件

## preset

转换一个语法可能需要很多插件共同参数，这样列出所有的插件就显的臃肿，所以，可以预置一些常用的插件集合，用到时只需要用这个集合就可以，这就是`preset`.常用的 preset 如：@babel/preset-env.这个 preset 支持所有的现代浏览器的语法。当然他也接受一些配置以启用或禁用一些语法转换

## polyfill

像箭头函数之类的新语法，可以通过转换为旧语法中的普通函数来兼容低版本浏览器。除此之外，像 Promise 这种新的 api 旧版本中没有对应功能，所以就需要在全局环境中添加这些 api 的模拟方法。这就需要 polyfill。`@babel/polyfill`包中包含了所有的 ES2015+的新的 api。如果知道自己确定的需要哪些 polyfill，可以引用`@babel/plugin-transform-runtime`或者是从 core-js 中单独引用用到的功能。

安装`@babel/polyfill`时需要用`--save`,因为需要在代码执行前运行 polyfill 代码。

`@babel/preset-env`支持传入一个选项`useBuiltIns`,当该值是’usage‘时，babel 只会在代码中用到该 api 时，才会引入对应 polyfill，防止包过大。如果该值不为 usage，那么只会判断 target 浏览器版本是否支持一个判断。

**`@babel/polyfill`在 7.4.0 后已经过时，现在用`"core-js/stable"（模拟es新特征）`和`regenerator-runtime/runtime`(模拟 generator)**

## 配置方式

babel 也支持`cosmiconfig`支持的配置方式

- package.json babel key
- babelrc
- babelrc.json/yaml/yml/js/cjs
- babel.config.js/json

## 配置项

### presets

Type: []

常用的几个 presets:`@babel/preset-env`、`@babel/preset-typescript`、`@babel/preset-react`、`@babel/preset-flow`。可以使用任何存在于 npm 上的 presets 包。namespace 是 babel-preset 或@babel/preset

presets 数组的优先级顺序是从后往前。
每个 preset 都支持传入该 preset 的配置选项。配置选项是一个对象，也就是下列三种是等价的。

```js
{
  "presets": [
    "presetA", // bare string
    ["presetA"], // wrapped in array
    ["presetA", {}] // 2nd argument is an empty options object
  ]
}
```

### plugins

Type: []

也分为两类 2. 语法插件

1. 转换插件 用来根据启用对应的语法插件转换代码
2. 语法插件 大多数语法都是 babel 来处理。很少情况下需要自定义允许 babel 解析特定语法，或者用来保留源码而不转换。

比如：可以为 babel 的解析器提供一个选项.(猜测下列选项是为了保留 jsx 语法，只需要 Babel 的代码分析功能)

```json
{
  "parserOpts": {
    "plugins": ["jsx"]
  }
}
```

执行顺序：plugins 的执行顺序是从前往后执行。这里与 preset 相反。并且他的执行顺序是优先于 presets 的。如下：

```json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"],
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

执行顺序是先从左至右执行两个 plugins。然后再从右向左的执行两个 presets。
为 plugins 设置选项的配置同 preset。

### **@babel/plugin-transform-runtime** **@babel/runtime**

两个插件需配合使用。首先@babel/runtime 是一个包含了一些 babel 内置函数的包，如：extends 等。
这些函数可能在多于两个文件中都使用。并且是在生产环境用。
如下

```js
class Circle {}
```

转换后

```js
function _classCallCheck(instance, Constructor) {
  //...
}

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```

上述说明在使用 babel 转换 class 时，都会用到一个\_classCallCheck 函数，但是当多个文件都用到 class 时，如果每个文件都声明一个\_classCallCheck 函数，那就未免造成体积很大。所以需要将用到该函数的地方都引用自同一处的函数。比如这样`var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");`。将所有重用的函数都转换为引用同一处的函数的过程就是由`@babel/plugin-transform-runtime`插件来做的，他会识别出重用的函数转换为 require 同一个包的函数。同时这也避免了使用全局变量的方式污染全局变量。

上述过程分析可知：@babel/runtime 需要作为 dependencies，而@babel/plugin-transform-runtime 需要作为 devDependencies.

### targets

描述希望支持的环境

```json
{
  "targets": "> 0.25%, not dead"
}
```

希望支持的特定浏览器的最低版本

```json
{
  "chrome": "58",
  "ie": "11"
}
```

如果不传设置 targets 属性，babel 默认是最旧的浏览器，将把所有的 es6 的代码转换为 es5 兼容的。

babel-plugin-import
