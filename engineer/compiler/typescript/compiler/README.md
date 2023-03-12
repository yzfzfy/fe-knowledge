# ts 编译器

用来编译 typescript 代码的编译器。

我们在项目中安装 typescript 依赖时，会在./node_modules/bin 中自动安装 tsc 命令。可调用 tsc 编译我们的 typescript 源码。

编译器的配置文件自动取当前目录下的`tsconfig.json`文件。

该文件可以通过`tsc -init`命令自动生成。

## compilerOptions 各配置项如下：

### target

代码运行目标的 js 版本，可选值有`es3`,`es5`,`es6`,`es2015/6/7/8/9/20/21/22`,`esnext`.

该设置会作用于哪些 js 特性会被降级，哪些被保留。

`ESNext`值比较特殊，因为它代表的不是某个 js 版本，而是当前 typescript 支持的最高 js 版本。而在不同阶段这个值代表的含义不同，所以慎用。

### module

Specify what module code is generated.指定想要生成哪种模块代码。值有`none`,`amd`,`umd`,`commonjs`,`es6`,`es2020`,`es2022`,`node16`,`nodenext`,你很可能要用到 commonjs。

### moduleResolution

Specify how TypeScript looks up a file from a given module specifier.

值有`classic`,`node16`,`nodenext`.classic 可能不再需要。

指定编译器如何解析文件路径。

**当 module 的值为 commonjs 时,moduleResolution 的值可以不设置。当 module 的值不为 commonjs 时，moduleResolution 的值必须为 node 的值**

### lib

TypeScript 包括一组默认的内建 JS 接口（例如 Math）的类型定义，以及在浏览器环境中存在的对象的类型定义（例如 document）。可以设置使用哪些内建接口.值为一个数组

### jsx

如何解析 tsx 中 jsx 的解析。值有`react`,`preserve`...等。react 时替换 jsx 为 React.createElement，preserve 时，保持 jsx 格式输出。

### baseUrl

Specify the base directory to resolve non-relative module names.
指定当解析非绝对路径时的基础目录。

### paths

一些将模块导入重新映射到相对于 baseUrl 路径的配置

```json
{
  "compilerOptions": {
    "baseUrl": ".", // this must be specified if "paths" is specified.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // this mapping is relative to "baseUrl"
    }
  }
}
```

### allowJs

允许 JavaScript 文件在你的工程中被引入，而不是仅仅允许 .ts 和 .tsx 文件。例如这个 JS 文件：

```js
// @filename: card.js
export const defaultCardDeck = "Heart";
```

当你引入到一个 TypeScript 文件时将会抛出一个错误,不允许引入 js 文件：

```ts
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

启用 allowJs 后，允许 .ts 和 .tsx 与现有的 JavaScript 文件共存。可以用于逐步将 TypeScript 文件逐步添加到 JS 工程中。

### checkJs

与 allowJs 配合使用，当 checkJs 被启用时，JavaScript 文件中会报告错误。也就是相当于在项目中所有 JavaScript 文件顶部包含 // @ts-check。

### declaration

是否生成.d.ts 文件。

为你工程中的每个 TypeScript 或 JavaScript 文件生成 .d.ts 文件。 这些 .d.ts 文件是描述模块外部 API 的类型定义文件。 可以通过 .d.ts 文件为非类型化的代码提供 intellisense 和精确的类型。

### emitDeclarationOnly

是否只生成类型文件，而不生成 js 文件

### outFile

编译后所有内容生成到一个文件中。

### outDir

编译后将所有文件放置到哪个目录中

### removeComments

是否移除注释

### noEmit

禁止编译器生成文件。例如 JavaScript 代码，source-map 或声明。

这为另一个工具提供了空间，例如用 Babel 或 swc 来处理将 TypeScript 转换为可以在 JavaScript 环境中运行的文件的过程。

然后你可以使用 TypeScript 作为提供编辑器集成的工具，或用来对源码进行类型检查。

### allowSyntheticDefaultImports

当设置为 true， 并且模块没有显式指定默认导出时，allowSyntheticDefaultImports 可以让你这样写导入：

`import React from "react"`而不是`import * as React from "react";`

为了使用方便，Babel 这样的转译器会在没有默认导出时自动为其创建，使模块看起来更像：

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};
module.exports = allFunctions;
module.exports.default = allFunctions;
```

### esModuleInterop

ES 模块互操作性

`Object.defineProperty(exports, "__esModule", { value: true });`

### strict

开启 ts 中的严格模式。这里指的不是 js 中的严格模式。表示开启下列一系列的类型检查规则：

```
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true,
"strictBindCallApply": true,
"strictPropertyInitialization": true,
"noImplicitThis": true,
"alwaysStrict": true
```

如果设置为 true/false，表示这些值都为 true/false,其中某个值单独设置，以单独设置的为准。

### skipLibCheck

Skip type checking all .d.ts files

## exclude

作用是指定编译器需要排除的文件或文件夹。默认排除 node_modules 文件夹下文件。

## include

类似 exclude

## extends

作用是引入其他配置文件，继承配置。

默认包含当前目录和子目录下所有 TypeScript 文件。
