# with

with 语句用于扩展一个语句的作用域链。

语法：

```js
// expression 将给定的表达式添加到在评估语句时使用的作用域链上。表达式周围的括号是必需的。
with (expression) {
    // statement 任何语句。要执行多个语句，请使用一个块语句 ({ ... }) 对这些语句进行分组。
    statement;
}
```

## 简述

JavaScript 查找某个未使用命名空间的变量时，会通过作用域链来查找，作用域链是跟执行代码的 context 或者包含这个变量的函数有关。'with'语句将某个对象添加到作用域链的顶部，如果在 statement 中有某个未使用命名空间的变量，跟作用域链中的某个属性同名，则这个变量将指向这个属性值。如果沒有同名的属性，则将拋出 ReferenceError 异常。

> 不推荐使用 with，在 ECMAScript 5 严格模式中该标签已被禁止。推荐的替代方案是声明一个临时变量来承载你所需要的属性。

## 性能方面的利与弊

**利**：with 语句可以在不造成性能损失的情況下，减少变量的长度。其造成的附加计算量很少。使用'with'可以减少不必要的指针路径解析运算。需要注意的是，很多情況下，也可以不使用 with 语句，而是使用一个临时变量来保存指针，来达到同样的效果。

**弊**：with 语句使得程序在查找变量值时，都是先在指定的对象中查找。所以那些本来不是这个对象的属性的变量，查找起来将会很慢。如果是在对性能要求较高的场合，'with'下面的 statement 语句中的变量，只应该包含这个指定对象的属性。

## 语义不明的弊端

**弊端**：with 语句使得代码不易阅读，同时使得 JavaScript 编译器难以在作用域链上查找某个变量，难以决定应该在哪个对象上来取值。请看下面的例子：

```js
function f(x, o) {
    with (o) print(x);
}
```

f 被调用时，x 有可能能取到值，也可能是 undefined，如果能取到，有可能是在 o 上取的值，也可能是函数的第一个参数 x 的值（如果 o 中没有这个属性的话）。如果你忘记在作为第二个参数的对象 o 中定义 x 这个属性，程序并不会报错，只是取到另一个值而已。

**弊端**：使用 with 语句的代码，无法向前兼容，特別是在使用一些原生数据类型的时候。看下面的例子：

```js
function f(foo, values) {
    with (foo) {
        console.log(values);
    }
}
```

如果是在 ECMAScript 5 环境调用 f([1,2,3], obj)，则 with 语句中变量 values 将指向函数的第二个参数 values。但是，ECMAScript 6 标准给 Array.prototype 添加了一个新属性 values，所有数组实例将继承这个属性。所以在 ECMAScript 6 环境中，with 语句中变量 values 将指向[1,2,3].values。

## 总结

with 的参数其实就是规定{}中代码的无主变量的宿主对象。作用域链就是块级代码中寻找无主变量的查找链接，使用 with 语句后相当于在链中添加了一层。作用域是代码解析过程中引擎创建的一条查找链，with 是手动添加的。
