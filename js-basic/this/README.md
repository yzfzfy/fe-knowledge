# this

## 值：当前执行上下文（global、function 或 eval）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。但是`this`不能在执行期间被赋值。

-   全局上下文中，this 总指向全局对象
-   函数上下文中，this 的值取决与函数被调用的方式
-   类上下文中，与在函数中类似，因为类本质也是函数，但是在构造函数中，this 是一个常规对象。类中所有的非静态的方法都会被添加到 this 的原型中。
-   派生类中，派生类的构造函数并没有初始的 this 绑定，所以必须在构造函数中调用 super()生成一个 this 绑定，并相当于执行了父类的实例化。

## 常用到的 this 地方

在 call、apply、bind 中绑定函数中的 this 到一个新对象上。
箭头函数中，this 与封闭词法环境的 this 保持一致
getter 与 setter 中的 this，会把 this 绑定到设置或获取属性的对象。
作为构造函数，它的 this 被绑定到正在构造的新对象。
作为一个 DOM 事件处理函数， 当函数被用作事件处理函数时，它的 this 指向触发事件的元素.`console.log(this === e.currentTarget); // 总是 true`,

## 为什么有 this

既然 this 容易让开发者迷惑，那他到底有什么用，相比它的迷惑性来说，它的价值是否更大。
看一段代码：

```js
function identify() {
    return this.name.toUpperCase();
}

function speak() {
    var greeting = "Hello, I'm " + identify.call(this);
    console.log(greeting);
}

var me = {
    name: 'Kyle',
};

var you = {
    name: 'Reader',
};

identify.call(me); // KYLE
identify.call(you); // READER

speak.call(me); // Hello, I'm KYLE
speak.call(you); // Hello, I'm READER
```

上方代码可以看出`identify()和`speak()`函数会在多个上下文对象中被调用执行(me 和 you)。如果不这样的话，可能就需要新建两个分别绑定两个上下文对象的函数、或者是将上下文对象作为函数参数传入。
如下：

```js
function identify(context) {
    return context.name.toUpperCase();
}

function speak(context) {
    var greeting = "Hello, I'm " + identify(context);
    console.log(greeting);
}

identify(you); // READER
speak(me); // Hello, I'm KYLE
```

从上边大致可以看出，当把 context 传入参数时，context 可能出现在任何函数的参数列表中，无疑增加了复杂度。this 机制提供了一个更优雅的传入一个对象引用的方式，在 api 设计上更清晰，也更易用。

## 关于`this`的不正确理解

1. this 不指向当前函数本身
2. this 不指向当前函数的作用域

## 总结

this 是在运行时确定的，而不是在定义时确定。定义时它什么也没做。

一个函数被调用时，生成一个称为执行上下文的激活记录。这个激活记录包含了函数的调用栈、函数是怎么被调用、参数是什么等等。this 就是这个激活记录的属性之一，在函数执行期间都可用。

## this 是怎么确定的

-   默认绑定

```js
// 指向全局对象
function foo() {
    console.log(this.a);
}

var a = 2;

foo(); // 2
```

```js
function foo() {
    'use strict';

    // strict mode下 this为undefined
    console.log(this.a);
}

var a = 2;

foo(); // TypeError: `this` is `undefined`
```

-   隐式绑定

```js
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo,
};

obj.foo(); // 2
```

-   显式绑定(硬绑定)

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
};

foo.call(obj); // 2
```

-   API Call "Contexts"

```js
function foo(el) {
    console.log(el, this.id);
}

var obj = {
    id: 'awesome',
};

// use `obj` as `this` for `foo(..)` calls
[1, 2, 3].forEach(foo, obj); // 1 awesome  2 awesome  3 awesome
```

-   new Binding

When a function is invoked with new in front of it, otherwise known as a constructor call, the following things are done automatically:

1. a brand new object is created (aka, constructed) out of thin air
2. the newly constructed object is [[Prototype]]-linked
3. the newly constructed object is set as the this binding for that function call
4. unless the function returns its own alternate object, the new-invoked function call will automatically return the newly constructed object.

## 总结

以上，列出了四种函数调用时绑定 this 的方式。要找出 this 指向的话，唯一需要做的就是看他使用了上述哪种方式。确定`this`的过程,优先级顺序如下，当匹配到第一个时就停止继续匹配:

1. 函数是都被 new 关键字调用。如果是，this 就指向新构造的对象。var bar = new foo()
2. 函数是否用 call 或者 apply 调用。或者是否经过 bind 硬绑定过，如果是，this 是明确绑定的对象
3. 函数是否用 context 调用，如果是 this 指向是那个 context 对象
4. 否则，this 指向默认绑定值。严格模式下 this 是 undefined，非严格模式指向全局对象。

箭头函数是不适用上述的原则的，它是用词法作用域作为 this 绑定的，这意味着它不适用函数调用决定 this。

```js
function foo() {
    // return an arrow function
    return (a) => {
        // `this` here is lexically adopted from `foo()`
        console.log(this.a);
    };
}

var obj1 = {
    a: 2,
};

var obj2 = {
    a: 3,
};

var bar = foo.call(obj1);
bar.call(obj2); // 2, not 3!
```
