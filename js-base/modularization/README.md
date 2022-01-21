# 模块化

## 模块化

一个有着简单交互逻辑的页面，本身代码很少的情况下，完全一个 js 文件就可解决问题。只有在逻辑、代码量到一定量级时，才会出现模块化的问题。

-   当代码达到需要拆分成几个文件的量级时，或许在每个文件中为全局变量挂载不同的属性，在这些变量属性下写具体的逻辑就可初步解决问题，不至于全局变量上挂载太多的属性，造成变量污染。总的代码量也不会太多，易于维护。这种方式还有一个特点就是这种模块不是以文件为单位的，一个 js 文件中可以定义多个变量。

```js
// 例
// a.js
window.a = {};
window.b = function () {};
// b.js
window.c = function () {};
```

-   达到下一个量级阶段时，全局变量过多，不好维护。这时候就用到闭包方式，闭包内返回模块对象，只需对外暴露一个全局变量。闭包模块化可以访问到模块内部变量，做增删改查。

```js
// 例
// a.js
window.a = (function(){
    ...
    ...
    return {
        a: {},
        b: function () {},
    }
})()
```

-   到这里的模块化仍然不是以文件为单位的,其实还不能说是真正的模块化。直到 commonjs 出现，首先在服务端实现。

```js
const a = require('a');

function b() {
    const c = a();

    return c;
}

module.exports = b;
```

-   Amd, 与 commonjs 几乎是同一时期的产物，这个方案主要解决前端动态加载依赖，相比 commonjs，体积更小，按需加载。

```js
    // a.js
    define([], function(require) {
        var a = require('定义的模块标识');
        ...
        ...
        return {};
    })
```

-   umd, 为了兼容在不同环境下使用同一份逻辑代码。主要加了一段判断不同环境的代码。

```js
// 一般实现代码 https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    // 判断是在amd环境中执行
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // 作为commonjs模块被用
        module.exports = factory();
    } else {
        // 作为全局变量
        root.returnExports = factory();
    }

})(window, function() {
    ...
    ...
    return xxx;
})
```
