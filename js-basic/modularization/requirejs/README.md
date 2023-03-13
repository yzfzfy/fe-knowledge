# requirejs/amd 实践

requirejs 定义了一个异步加载模块的方案。

## 使用

首先引入 requirejs 库，使用 script 标签引入，然后将该 script 文件的`data-main`属性的值为主入口 js 文件的相对路径。效果就是在加载完该库后，自动寻找 data-main 的属性值，然后执行主入口 js 文件.相比于传统的写一堆 script 标签来加载 js 文件，requirejs 加载 js 模块是基于相对路径的。

首先看 requirejs 是怎么定义一个模块的.

```js
// 该模块没有依赖的情况
define(function () {
    // 该模块的导出结果
    return;
});

// 该模块有依赖的情况
define(['依赖模块的路径'], function (depA) {
    // 该模块的导出结果
    return;
});

// 第三种定义方式特殊。是为了模仿简单的commonjs 包裹。
// 在commonjs模块中的require、module、exports这些变量是默认存在的。这个定义方式不写第一个依赖数组参数，而是注入这三个特殊模拟函数，供函数体使用。
define(function (require, exports, module) {
    var a = require('a'),
        b = require('b');

    //Return the module value
    return function () {};
});
```

如上用法可以看出当一个模块依赖另外一个模块时，需要写入引入模块的相对路径，这里就会出现一个问题。如果该相对路径很长、或者是一个 cdn 上的 js 文件。那么写在这里的路径会很长，这很不优雅。解决方案就是：

requirejs 执行配置该项目中用到的模块的别名。这样就可以简化依赖模块的书写。同时，本地开发时，一般来说本地文件目录是有条理的，或者说可能放在固定的文件夹内。所以 requirejs 支持了如下配置

```js
requirejs.config({
    // 模块查找目录的基础路径。
    // 默认是html页放置的目录
    baseUrl: 'js',
    // 支持定义每个模块的别名，值是相对于baseUrl的值
    // paths中的value都是相对与baseUrl值的路径，支持../这种形式。并且没必要写后缀.js，requirejs默认认为模块文件时js的.
    // 如果不想用baseUrl+paths的方式查找模块，可用下列三种方式
    // 1.值以.js结尾  2.值以/开头  3.值以协议http://或https://开头
    paths: {
        jquery: 'lib/jquery-3.6.0.min.js',
        // message: 'app/message',
        // print: 'app/print',
    },
});

// 开始执行项目的入口逻辑. 相当于启动项目，也就是开始加载js文件。
requirejs([], function () {});
```
