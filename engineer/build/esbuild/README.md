# esbuild

## 它是使用 Go 语言编写的打包器。速度是其他常用构建工具的 10 - 100 倍

## 选项

### 通用选项

esbuild 在 js、cli、transform 值通用的值。

- bundle 该选项默认是关闭的。现将此开关开启关闭时的情况分别尝试，如下例：

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

- Live reload。此选项需要首先开启 watch 和 serve 属性。watch 属性是为了检测到一个文件改动时，重新开始编译；serve 会启动一个本地 server，展示打包后的文件目录。同时开启选项后，当文件改动时，自动编译，本地 server 自动刷新展示新的编译输出。
- plaform。编译目标平台，默认值 browser，也可以设置为 node、neutral。不同的值，意味着对于某些特定平台的库或方法处理不同。
- Tsconfig。用来处理 ts 文件时，自动寻找 tsconfig.json 文件。

### 关于打包输入的选项

- Entry points。在 cli 中传入的多个文件即使用多个入口点。
- loader。--loader:.svg=text 为特定的文件扩展使用不同的 loader 处理。

### output location

- chunk name 打包输出 chunk 名规则。
- outdir。--outdir=out，打包后输出文件的目录
- Outfile。输出文件的名称

### 文件路径解析

- Alias
- External
- resolve-extensions=.ts,.js
