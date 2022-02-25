# rollup

Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application. It uses the new standardized format for code modules included in the ES6 revision of JavaScript, instead of previous idiosyncratic solutions such as CommonJS and AMD.

模块打包器。编译小段的片段代码成为一整个代码，比如打包一个库或应用。利用新的代码格式标准如 es6，而不是旧的 CommonJS 和 amd 格式

## from ESModule to AMD or CommonJS IIFE

也可以利用已有的 CommonJS 模块

## tree-shaking

利用 ES6 的`import` `export`

## publish ES Modules

可以把 esmodule 编译为 umd 或 commonjs 格式，然后荣国 pckage.json 中的 main 字段分别指向各个格式的包。
如果 packges.json 里有 module 字段，rollup 将直接引用 esmodule 版本

## 配置文件

```js
// rollup.config.js
import json from '@rollup/plugin-json';

export default {
    input: 'src/main.js',
    output: {
        file: 'bundle.js',
        format: 'cjs',
    },
    plugins: [json()],
};
```
