# commonJS CMD AMD ESModule

## commonJS:

nodejs 使用的规范。
特性

-   输出的是值的拷贝
-   运行时加载：在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”
    keyword:

-   `module.exports = ....`
-   `exports.something = ....`
-   `require('path')`

## CMD 玉伯 A Module Loader for the Web 可以像 Node.js 一般书写模块代码。(module.exports)

seajs 推广中的规范
特性

-   依赖的模块延迟执行（依赖就近）。当前模块执行前不会执行他依赖的模块

```js
define((require, exports, module) => {

    var $ = require('jquery');

    module.exports = ...

    或
    // 与nodejs同样 不可改变exports的指向export = {}
    exports.something = ...
})
```

## AMD：

requirejs 推广中形成的规范。
特性

-   依赖提前执行（依赖前置）。

```js
define('moduleName'?, [dep1, dep2]?,function(dep1, dep2){
    return any
})
```

## ESModule

ES6 的新语法。将原生 js 支持模块化，但是需要浏览器支持。目前还是由 babel 做降级处理，低版本浏览器也可支持。
特性

-   ES6 模块输出的是值的引用。编译是该引用就生成，可以想象成../../的符号连接，import 该模块时再去找该引用的值。ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import 时采用静态命令的形式。即在 import 时可以指定加载某个输出值，**而不是加载整个模块**，这种加载称为“编译时加载”。模块内部引用的变化，会反应在外部。便于做 tree-shaking

keyword:

1. `import a from 'a'`
2. `import a as B from 'a'`
3. `export default` 4.`export function a() {}`
4. `export const a = 1`
5. `export * from 'a'`
6. `export { a, b, c} from 'a'`

# 循环依赖问题
