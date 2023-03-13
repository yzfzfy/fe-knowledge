# rollup

Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application. It uses the new standardized format for code modules included in the ES6 revision of JavaScript, instead of previous idiosyncratic solutions such as CommonJS and AMD.

模块打包器。编译小段的片段代码成为一整个代码，比如打包一个库或应用。利用新的代码格式标准如 es6，而不是旧的 CommonJS 和 amd 格式

## from ESModule to AMD or CommonJS IIFE

也可以利用已有的 CommonJS 模块

## tree-shaking

利用 ES6 的`import` `export`

## publish ES Modules

可以把 esmodule 编译为 umd 或 commonjs 格式，然后通过 pckage.json 中的 main 字段分别指向各个格式的包。
如果 packges.json 里有 module 字段，rollup 将直接引用 esmodule 版本

## 配置文件

```js
// rollup.config.js
import json from "@rollup/plugin-json";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins: [json()],
};
```

## 配置项

### external

cli: -e,--external

该选项用于匹配需要保留在 bundle 外部的模块，它的值可以是一个接收模块 id 参数并且返回 true（表示排除）或 false（表示包含）的函数，也可以是一个由模块 ID 构成的数组，还可以是可以匹配到模块 ID 的正则表达式。

关于内部处理的一个知识点：当模块引入路径为相对路径`./`,`../`时，rollup 解析时会把引入的模块 id 解析为系统绝对路径，以便不同入口引入同一个文件时，识别已经解析过的模块。当 bundle 结束写文件操作结束之前，在将引入绝对路径的模块路径转换为最终的相对路径地址。

其实 output 中的 file 和 dir 一样最终都要保持 file 是在 dir 中。

### input

cli： -i / --input
类型：string | string [] | { [entryName: string]: string }

bundle 的入口文件。当为对象形式时，对象的键名将作为将作为生成文件名的 name，并且如果在键名中有'/',最终产物会被打包到最终的不同文件夹中。

### output

output.dir

该选项用于指定所有生成 chunk 文件所在的目录。如果生成多个 chunk，则此选项是必须的。否则，可以使用 output.file 选项代替。

output.file

该选项用于指定要写入的文件名。如果该选项生效，那么同时也会生成源码映射（sourcemap）文件。只有当生成的 chunk 不超过一个时，该选项才会生效。

output.format

类型：string
cli：-f/--format

该选项用于指定生成 bundle 的格式。可以是以下之一：

- amd
- cjs.适用于 Node 环境和其他打包工具（别名：commonjs）
- es.将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
- iife.自执行函数，适用于 <script> 标签。（如果你要为你的应用创建 bundle，那么你很可能用它。）
- umd.通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
- system

output.globals
类型：{ [id: string]: string } | ((id: string) => string)
命令行参数：-g/--globals

该选项用于使用 id: variableName 键值对指定的、在 umd 或 iife 格式 bundle 中的外部依赖。

如：`import $ from 'jquery';`,我们想要告诉 Rollup jquery 是外部依赖，并且 jquery 模块的 ID 为全局变量 $：

```js
// rollup.config.js
export default {
  ...,
  external: ['jquery'],
  output: {
    format: 'iife',
    name: 'MyBundle',
    globals: {
      jquery: '$'
    }
  }
};

/*
var MyBundle = (function ($) {
  // code goes here
}($));
*/
```

output.name
类型：string
命令行: -n/--name <variableName>

该选项用于，在想要使用全局变量名来表示你的 bundle 时，输出格式必须指定为 iife 或 umd。同一个页面上的其他脚本可以通过这个变量名来访问你的 bundle 导出。

output.plugins

类型：OutputPlugin | (OutputPlugin | void)[]

该选项用于指定输出插件，这是设置插件的唯一入口。引用插件要调用引入的函数（例如，应该使用 commonjs()，而不是 commonjs）。返回值为 Falsy 的插件将会被忽略，这样可以用于灵活启用和禁用插件。

### plugins

同 output.plugin。 rollup 的插件大部分由官方提供。与 babel 插件的命名空间相似。`@rollup/plugin-xxx`
