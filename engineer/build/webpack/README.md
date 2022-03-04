# webpack

静态模块打包器。用于打包一个 spa 应用。从 html、css、js 处理每一部分内容，输出生产环境可用的资源。

通过一步步的解析文件，当解析到依赖时，就去找依赖文件，最终把所有用到的模块 js 文件都处理后，输出内容。

下列是基于`webpack: ^5.69.1`

## 主要关注的问题和功能

### 整体打包原理

webpack 提供编译器(npm 包 webpack 或者 webpack-cli)，如 npm 包是以`const compiler = webpack(config)`生成编译器。然后`compiler.run`开始打包过程，传入 webpack 支持的配置项`entry`,编译器从入口点开始分析代码依赖树，内部维护一个`dependencies graph`，直至没有新的依赖文件，处理到某个匹配文件时，对文件应用 config 中的对应 loader，到达某个编译节点时，执行预先定义的在此钩子上定义的任务等，然后将所有代码逻辑打包成若干个处理过的 js 文件和样式文件。输出到 config 中定义的 output 的目录中。

### 打包结果的代码分析

简单的代码依赖如下：

```js
// index.js
import { assign } from './util';

assign({}, { name: 'foo' });

// util.js
export function assign(source, dest) {
    return Object.assign(source, dest);
}

// webpack.config.js
const path = require('path');

module.exports = {
    mode: 'development/production',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
```

先看`mode='production'`的情况，打包后的结果:

```js
// dist/main.js
(() => {
    'use strict';
    var e = {};
    ((e) => {
        'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(e, '__esModule', { value: !0 });
    })(e),
        console.log((0, e.assign)({}, { name: 'foo' }));
})();
```

可以发现，webpack 将两个有依赖关系的文件的逻辑合并成了一个，说明 webpack 在这个过程中做了优化。总体上一个 iife 的形式。

然后看`mode='development'`的情况，打包后的结果:

```js
// 代码省略了一些代码
(() => {
    // webpackBootstrap
    'use strict';
    var __webpack_modules__ = {
        './src/index.js': (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            eval(
                '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");\n\r\n\r\nconsole.log((0,_util__WEBPACK_IMPORTED_MODULE_0__.assign)({}, { name: \'foo\' }));\r\n\n\n//# sourceURL=webpack://webpack/./src/index.js?',
            );
        },

        './src/util.js': (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            eval(
                '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "assign": () => (/* binding */ assign)\n/* harmony export */ });\nfunction assign(source, dest) {\r\n    return Object.assign(source, dest);\r\n}\r\n\n\n//# sourceURL=webpack://webpack/./src/util.js?',
            );
        },
    };
    // The module cache
    var __webpack_module_cache__ = {};

    // The require function
    function __webpack_require__(moduleId) {
        // Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        // Create a new module (and put it into the cache)
        var module = (__webpack_module_cache__[moduleId] = {
            // no module.id needed
            // no module.loaded needed
            exports: {},
        });

        // Execute the module function
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

        // Return the exports of the module
        return module.exports;
    }

    /* webpack/runtime/define property getters */
    (() => {
        // define getter functions for harmony exports
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                }
            }
        };
    })();

    /* webpack/runtime/hasOwnProperty shorthand */
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();

    (() => {
        // define __esModule on exports
        __webpack_require__.r = (exports) => {
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            }
            Object.defineProperty(exports, '__esModule', { value: true });
        };
    })();

    var __webpack_exports__ = __webpack_require__('./src/index.js');
})();
```

分析：
总体上还是一个`iife`的形式,总体上函数内部定义了一些这样的函数`__webpack_xx__`。先是**webpack_modules**对象，key 是源文件中的两个 js 文件，value 是一个函数，函数内是用 eval 执行的字符串。
然后是一个**webpack_require**函数，这个函数是开发环境生成代码的核心内容。然后往下是挂载在**webpack_require**函数对象上的一些值，直到最后一行，调用了`__webpack_require__('./src/index.js');`,再回看**webpack_require**函数，他接收一个 moduleId 形参，从调用上看，moduleId 就是源文件的相对路径。看函数内容，先是判断**webpack_module_cache**中有没有个该 moduleId 的值，第一次执行，显然没有，然后初始化了一个有一个 exports 为 key 的对象赋给了**webpack_module_cache**。也就是再次执行 require 这个模块时，直接返回**webpack_module_cache**[moduleId]['exports']的值。再往下执行，有`__webpack_modules__[moduleId](module, module.exports, __webpack_require__)`,是从之前的**webpack_modules**对象取出函数执行，此刻执行了 eval 函数，现在看`'./src/index.js'`的值，精简后

```js
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/util.js");
    console.log((0, _util__WEBPACK_IMPORTED_MODULE_0__.assign)({}, { name: 'foo' }));
},
```

这里的**webpack_require**.r 看出是一个`Object.defineProperty(exports, '__esModule', { value: true });`之后再看。这里看到了**webpack_require**("./src/util.js")，同样的执行过程，找出**webpack_modules**内'./src/util'的值，

```js
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
   __webpack_require__.r(__webpack_exports__);
   __webpack_require__.d(__webpack_exports__, {"assign": () => assign });
   function assign(source, dest) {return Object.assign(source, dest);}
},
```

这次多了一个**webpack_require**.d 函数，看定义是为**webpack_exports**内加了 key 为 assign，value 为 assign 函数的值。这样就回调到了 index.js 中`var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/util.js");`,到这里\_util**WEBPACK_IMPORTED_MODULE_0**的值就为`{ assign: function assign() { native code }}`,然后执行了 assign 函数。至此整个逻辑就执行完毕了，最简版的 webpack 打包结果就是如此。纵观整个过程，发现**webpack_require**是核心，相当于 webpack 内部实现了一个模块化的过程，也缓存了已加载的模块。**webpack_require**下挂载的一系列的函数都是一些辅助函数。

### 懒加载

以上的代码在页面引用`main.js`时,相当于所有的源代码一次性的加载到页面，如果有些逻辑是按需加载即可，那就涉及到了动态加载代码和执行。分析如下源码

```js
// index.js
function test() {}

test();

import('./util').then((res) => console.log(res));

// util.js
export function test() {}

// webpack.config.js
const path = require('path');

module.exports = {
    mode: 'development/production',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
```

切换 development 和 production 的情况，发现增加了一个 js 文件，而且除了生产模式有代码压缩替换和开发模式下有源代码真实相对路径外，大部分和没有懒加载时开发模式下的代码相似，所以用 development 的情况统一分析。
大致增加了一下函数、值(重要的)：

-   **webpack_require**.e

```js
__webpack_require__.e = (chunkId) => {
    return Promise.all(
        Object.keys(__webpack_require__.f).reduce((promises, key) => {
            __webpack_require__.f[key](chunkId, promises);
            return promises;
        }, []),
    );
};
```

-   **webpack_require**.f.j

```js
__webpack_require__.f.j = (chunkId, promises) => {
    // JSONP chunk loading for javascript
    var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
    if (installedChunkData !== 0) {
        //省略代码
        __webpack_require__.l(url, loadingEnded, 'chunk-' + chunkId, chunkId);
        //省略代码
    }
};
```

-   **webpack_require**.l

```js
__webpack_require__.l = (url, done, key, chunkId) => {
    // 省略代码
    if (!script) {
        needAttach = true;
        script = document.createElement('script');

        script.charset = 'utf-8';
        script.timeout = 120;
        if (__webpack_require__.nc) {
            script.setAttribute('nonce', __webpack_require__.nc);
        }
        script.setAttribute('data-webpack', dataWebpackPrefix + key);
        script.src = url;
    }
    // 省略代码
    var onScriptComplete = (prev, event) => {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        var doneFns = inProgress[url];
        delete inProgress[url];
        script.parentNode && script.parentNode.removeChild(script);
        doneFns && doneFns.forEach((fn) => fn(event));
        if (prev) return prev(event);
    };
    var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
    script.onerror = onScriptComplete.bind(null, script.onerror);
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
};
```

-   **webpack_require**.p

```js
var scriptUrl;
if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + '';
var document = __webpack_require__.g.document;
if (!scriptUrl && document) {
    if (document.currentScript) scriptUrl = document.currentScript.src;
    if (!scriptUrl) {
        var scripts = document.getElementsByTagName('script');
        if (scripts.length) scriptUrl = scripts[scripts.length - 1].src;
    }
}
// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
if (!scriptUrl) throw new Error('Automatic publicPath is not supported in this browser');
scriptUrl = scriptUrl
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\/[^\/]+$/, '/');
__webpack_require__.p = scriptUrl;
```

-   webpackJsonpCallback

```js
var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    var [chunkIds, moreModules, runtime] = data;
    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    var moduleId,
        chunkId,
        i = 0;
    if (chunkIds.some((id) => installedChunks[id] !== 0)) {
        for (moduleId in moreModules) {
            if (__webpack_require__.o(moreModules, moduleId)) {
                __webpack_require__.m[moduleId] = moreModules[moduleId];
            }
        }
        if (runtime) var result = runtime(__webpack_require__);
    }
    if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
    for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
            installedChunks[chunkId][0]();
        }
        installedChunks[chunkId] = 0;
    }
};
```

-   chunkLoadingGlobal[]

```js
var chunkLoadingGlobal = (self['webpackChunkwebpack'] = self['webpackChunkwebpack'] || []);
```

-   chunkLoadingGlobal.push

```js
chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
```

先跳过一系列定义，从 chunkLoadingGlobal 定义开始，它是个数组，并且他的 push 方法被重写了。重写后的 push 方法第一个参数还是 push 方法，先不深究。
然后再看熟悉的开始执行入口文件`__webpack_require__("./src/index.js");`,在之前**webpack_modules**中没有 util 文件，只有 index.js。说明那部分代码被独立出去单独成为了一个文件。eval 代码中执行了**webpack_require**.e("src_util_js")，回看**webpack_require**.e 函数，接收一个 moduleId 参数，生成一组 promise，其中生成每个 promise 的同时，在全局有个 installedChunks 的对象，保存了每个 moduleId 的加载状态（值是一个数组，把当前 promise 状态 resolve 和 reject 函数放入了，成功后会改成 0），promise 内部的逻辑都是拼装了一系列参数（主要的是 url 参数,它的值最终是`"" + chunkId + ".main.js";`,猜想这个 url 就是另外一个 js 文件的路径），走到了**webpack_require**.l，l 方法大致是初始化了 script 标签、src 赋值为 url 值和文件加载完成之后的回调，然后通过`document.head.appendChild(script)`开始加载文件。然后再去看另一个 js 文件中的内容：

```js
(self['webpackChunkwebpack'] = self['webpackChunkwebpack'] || []).push([
    ['src_util_js'],
    {
        './src/util.js': (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, { test: () => test });
            function test() {}
        },
    },
]);
```

加载完该文件后自动执行，调用之前的 webpackChunkwebpack 数组对象的 push 方法，传参是一个数组，第一项也是一个数组，只有当前文件的相对路径一项，第二项是 webpack_modules 类似的值，这里就用到了 push 方法，再回看 push 方法 webpackJsonpCallback 的逻辑，显示将数组第二项的类 webpack_modules 对象合并到了 webpack_modules 对象上，再然后之前 installedChunks 的对应 moduleId 的值执行第一项，也就是 resolve 函数和 installedChunks[chunkId]值赋为 0。最后`__webpack_require__.e`执行结束后，回看刚才入口的 eval 执行，`__webpack_require__.e`最终 promise 的 then 回调是再次调用`__webpack_require__`获取`__webpack_modules__`中的 util.js,也就是要动态加载进来的 eval 代码了，then 可以无限添加，因为`__webpack_require__`函数返回值是当前模块的 exports，所以如果我们的代码动态 import 后有 then 的话（我们的代码添加了 then），这个 then 的 resolve 函数是可以接收到动态加载模块的导出的。（动态 import 的是一个文件，所以回调数据是一个 Module{\_\_esModule: true, test: function test() {}},导出的值就挂载在改对象下）
至此懒加载代码分析完毕

### 重要配置项的用法和原理

### 调试
