# esbuild

它是使用 Go 语言编写的打包器。速度是其他常用构建工具的 10 - 100 倍。

为什么快？
它是使用 go 语言编写的，直接编译为源代码的，一般的编译器是使用 js 编写的，在执行时需要先解析编译器的 js 代码，然后去执行，而 esbuild 是没有这一步的，直接解析编译源码。另外它也是多线程打包，进程之间分享内存，

## 选项

### 通用选项

esbuild 在 js、cli、transform 值通用的值。

-   bundle 该选项默认是关闭的。现将此开关开启关闭时的情况分别尝试，如下例：

```ts
// app.ts
import { b } from "./a";

let a: number = 12345;
console.log(a);
console.log(b);
```

```ts
// a.ts
export let b = 1;
```

这里有两个文件 `app.ts`,`a.ts`, app 中引用了 a 文件的一个变量,现在分别尝试开启关闭 bundle 的打包输出

默认关闭该选项时,生成的 app.js 文件内容为

```js
import { b } from "./a";
let a = 12345;
console.log(a);
console.log(b);
```

开启该选项时，app.js 为

```js
(() => {
    // a.ts
    var b = 1;

    // app.ts
    var a = 12345;
    console.log(a);
    console.log(b);
})();
```

可见开启/关闭的区别在于，当关闭时，只是解析你的入口文件输出。当开启时，会递归的分析文件依赖，依赖的依赖，解析逻辑，可能最终解析生成为一个文件。并且不是简单的将两个文件拼接在一起，而是编译优化为一个整体执行逻辑。

-   Live reload。此选项需要首先开启 watch 和 serve 属性。watch 属性是为了检测到一个文件改动时，重新开始编译；serve 会启动一个本地 server，展示打包后的文件目录。同时开启选项后，当文件改动时，自动编译，本地 server 自动刷新展示新的编译输出。
-   plaform。编译目标平台，默认值 browser，也可以设置为 node、neutral。不同的值，意味着对于某些特定平台的库或方法处理不同。
-   Tsconfig。用来处理 ts 文件时，自动寻找 tsconfig.json 文件。

### 关于打包输入的选项

-   entryPoints。在 cli 中传入的多个文件即使用多个入口点。
-   loader。--loader:.svg=text 为特定的文件扩展使用不同的 loader 处理。

### output location

-   chunk name 打包输出 chunk 名规则。
-   outdir。--outdir=out，打包后输出文件的目录
-   Outfile。输出文件的名称
-   write 调用 js API buildSync。可以选择不将打包结果写入文件系统，将返回的文件写入内存中缓存。默认 cli 模式和 js Api 模式默认会写入文件系统。

### 文件路径解析

-   Alias
-   External 传入数组，忽略不想要打入包中的引用。可以是一个 npm 包、一种文件类型、一个目录下的所有文件
-   resolve-extensions。当以 require('./file')格式引入文件时，指定应该以何种文件格式解析此文件。默认的‘.tsx,.ts,.jsx,.js,.css,.json’

### format

`iife`,`cjs`,`esm`

### 转化

-   jsx 关于如何处理 jsx 的设置。三个值：transform、preserve、automatic

### optimization

-   ignoreAnnotations。js 是一门动态语言，所以对于编译器去识别未用到的代码是很困难的。为了方便做这一点，社区逐渐发展出了两种方法便于编译器识别。一种是`/* @__PURE__ */`,该行内注释可以放在函数调用前，如果函数返回值没有被用到则意味着编译器可以去掉该函数调用。第二种是在 package.json 中添加`sideEffects`字段，用来告诉编译器如果某个文件中的导出都没有被引入，则可以移除该文件。但是这两种在某种情况下都是不可靠的。该选项是用来忽略识别注释的，只有当遇到问题时，意外地把不想要删除的代码删除时可以打开该选项。开启时，会忽略上述两种情况。
-   minify。是否压缩代码。去除空格、重写语法为更简洁、变量名缩短。同样也适用于 css。
-   treeShaking。依赖于 esm 模块。在 bundle 启用或者 format 为 iife 时，该选项是默认开启的。也可以强制开启或关闭。

### sourcemap

-   sourcemap。有四种值。true/linked:单独生成 map 文件。在 js 底部以//# sourceMappingURL=的形式引用。external。类似第一种，但是在 js 文件底部不会添加 url。inline：在 js 文件底部添加 sourcemap，没有 map 文件生成。both：inline 与 external 的结合。

### 文件类型

下列是 esbuild 可以处理的文件类型。每一个类型，都有对应的 loader 可以处理，例如配置 esbuild 时`loader: {'.css': 'css'}`,就是使用 css loader 解析 css 文件。下列的类型都对应一种 loader。

-   javascript
-   typescript
-   jsx
-   json
-   css js 文件中引入的 css 文件，esbuild 会处理为单独一个 css 文件。但是不会自动在 html 中引入该 css，需要手动。同时也不支持 css module。这是 esbuild 的缺点之一，打包 js 可以，但是要想构建一个应用是有限制的。
-   text
-   binary
-   base64
-   dataurl
-   external file

### plugins

esbuild 同样也支持 plugins。[社区的插件列表](https://github.com/esbuild/community-plugins)

### 缺点

-   对于 css 类型文件的处理
-   对于 code split 的处理

这两点是主要制约 esbuild 被广泛应用于应用打包的场景，同时这两部分工具官方表示正在开发。

同时 plugin api 也在开发计划中。

html 类型、降级到 es5、打包顶级 await 也在开发中，但是优先级没有上述三点高。

同时官方表示不会做到像 webpack 那样，没想要太灵活，去兼容太多的配置和情况，去成为一个 all-in-one 的打包器，例如不支持的有：

> For example, I am not planning to include these features in esbuild's core itself:

-   Support for other frontend languages (e.g. Elm, Svelte, Vue, Angular)
-   TypeScript type checking (just run tsc separately)
-   An API for custom AST manipulation
-   Hot-module reloading
-   Module federation

## esbuild 用处

虽然 esbuild 已经很优秀、功能比较齐全了，但作者的意思是“探寻前端构建的另一种可能”，而不是要替代掉 Webpack 等工具。

目前看来，对于大部分项目来说，最好的做法可能还是用 esbuild-loader，将 esbuild 只作为转换器和代码压缩工具，成为流程的一部分。

```js
{
  test: /\.tsx?$/,
  loader: 'esbuild-loader',
  options: {
    loader: 'tsx',  // Or 'ts' if you don't need tsx
    target: 'es2015',
  tsconfigRaw: require('./tsconfig.json'), // If you have a tsconfig.json file, esbuild-loader will automatically detect it.
  }
},
optimization: {
  minimizer: [
    new ESBuildMinifyPlugin({
      target: 'es2015'  // Syntax to compile to (see options below for possible values)
      css: true  // Apply minification to CSS assets
    })
  ]
},
```
