# 数据类型

## 最新的 js 标准总共有 7 中原始数据类型。

原始类型：number、string、null、undefined、Boolean、Symbol、BigInt

引用类型：Object。

其他的引用类型都可以看作是由 object 派生出来的。如：Date、Array、Map、Set 等。

## 类型判断

typeof 操作符的唯一目的就是检查数据类型。并不能检查出具体的引用类型是哪个类型。他们返回的都是 object.

typeof 返回的结果有几种(都是小写)：boolean、number、undefined、string、object、function

如果想进一步的检查类型。

1. 可使用 instanceof。a instanceof B。原理是检查 B 的原型是否出现在 a 的原型链上。有则为 true。(也可能有误差)
2. 可使用 Object.prototype.toString。Object.prototype.toString.call(a);原理是 Object.prototype.toString()返回的值是一个字符串。包含了创建该值时最终调用的构造函数是哪个。

Object.prototype.toString.call(new Map()) === ‘[object Map]’
Object.prototype.toString.call(new Set()) === ‘[object Set]’
Object.prototype.toString.call(new Date()) === ‘[object Date]’

**Object.prototype.toString 判断原理**

当 toString(O) 方法被调用的时候，下面的步骤会被执行：

1. 如果 this 值是 undefined，就返回 [object Undefined]
2. 如果 this 的值是 null，就返回 [object Null]
3. 让 O 成为 ToObject(this) 的结果
4. 让 class 成为 O 的内部属性 [[Class]] 的值
5. 最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串

Object.prototype.toString 的结果有：

1. [object Number]
1. [object String]
1. [object Boolean]
1. [object Null]
1. [object Undefined]
1. [object Object]
1. [object Array]
1. [object Date]
1. [object Error]
1. [object RegExp]
1. [object Function]
1. [object Math]
1. [object JSON]
1. [object Arguments]

## 利用 toString 判断类型的工具方法

```js
// 来源与jquery源码中判断类型
var class2type = {};

// 生成class2type映射
'Boolean Number String Function Array Date RegExp Object Error'.split(' ').map(function (item, index) {
    class2type['[object ' + item + ']'] = item.toLowerCase();
});

function type(obj) {
    // 一箭双雕
    if (obj == null) {
        return obj + '';
    }
    // 上方列表中没有包含ES6中的Map、Set、Symbol，所以有了||'object'
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}
```

## 判断是否 plainObject

所谓‘纯粹的对象’。就是该对象是**通过 "{}" 或 "new Object" 创建的**，该对象含有零个或者多个键值对。

```js
// jquery实现版本：核心思想是判断对象原型的的构造函数是否是Object
// 上节中写 type 函数时，用来存放 toString 映射结果的对象
var class2type = {};

// 相当于 Object.prototype.toString
var toString = class2type.toString;

// 相当于 Object.prototype.hasOwnProperty
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;

    // 排除掉明显不是obj的以及一些宿主对象如Window
    if (!obj || toString.call(obj) !== '[object Object]') {
        return false;
    }

    /**
     * getPrototypeOf es5 方法，获取 obj 的原型
     * 以 new Object 创建的对象为例的话
     * obj.__proto__ === Object.prototype
     */
    proto = Object.getPrototypeOf(obj);

    // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
    if (!proto) {
        return true;
    }

    /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
    Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;

    // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
    return typeof Ctor === 'function' && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);

    // 这里注意：函数的 toString 方法会返回一个表示函数源代码的字符串。具体来说，包括 function关键字，形参列表，大括号，以及函数体中的内容。
}
```

```js
// redux实现的版本：核心思想是通过{}或new Object创建的对象的原型对象的原型对象是null。
function isPlainObject(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
}
```

## 强制类型类型转换

1. 原始值转布尔

使用 Boolean 函数将类型转换成布尔类型。js 中只有 6 中值可以被转换成 false。其他都会被转换成 true。
console.log(Boolean()) // false

console.log(Boolean(false)) // false

console.log(Boolean(undefined)) // false
console.log(Boolean(null)) // false
console.log(Boolean(+0)) // false
console.log(Boolean(-0)) // false
console.log(Boolean(NaN)) // false
console.log(Boolean("")) // false

2. 原始值转数字
   使用 Number 函数转换成数字类型，如果参数无法转换成数字，则返回 NaN。
   [ES5 规范 15.7.1.1](http://es5.github.io/#x15.7.1.1)中介绍。根据规范，如果 Number 函数不传参数，返回 +0，如果有参数，调用 ToNumber(value)。注意这个 ToNumber 表示的是一个底层规范实现上的方法，并没有直接暴露出来。

而 ToNumber 则直接给了一个对应的结果表。表如下：

| 参数类型  | 结果                                       |
| --------- | :----------------------------------------- |
| Undefined | NaN                                        |
| Null      | +0                                         |
| Boolean   | 如果参数 true，返回 1.参数为 false，返回+0 |
| Number    | 返回与之相等的值                           |
| String    | 这段比较复杂，看例子                       |

console.log(Number("123")) // 123
console.log(Number("-123")) // -123
console.log(Number("1.2")) // 1.2
console.log(Number("000123")) // 123
console.log(Number("-000123")) // -123

console.log(Number("0x11")) // 17

console.log(Number("")) // 0
console.log(Number(" ")) // 0

console.log(Number("123 123")) // NaN
console.log(Number("foo")) // NaN
console.log(Number("100a")) // NaN

结论：如果通过 Number 转换函数传入一个字符串，它会试图将其转换成一个整数或浮点数，而且会忽略所有前导的 0，如果有一个字符不是数字，结果都会返回 NaN，鉴于这种严格的判断，我们一般还会使用更加灵活的 parseInt 和 parseFloat 进行转换。

parseInt 只解析整数，parseFloat 则可以解析整数和浮点数，如果字符串前缀是 "0x" 或者"0X"，parseInt 将其解释为十六进制数，**parseInt 和 parseFloat 都会跳过任意数量的前导空格，尽可能解析更多数值字符，并忽略后面的内容**。如果第一个非空格字符是非法的数字直接量，将最终返回 NaN：

3. 原始值转字符串
   使用 String 函数转换为字符串类型，看 规范[15.5.1.1](http://es5.github.io/#x15.5.1.1)中有关 String 函数的介绍：
   如果 String 函数不传参数，返回空字符串，如果有参数，调用 ToString(value)，而 ToString 也给了一个对应的结果表。表如下：

| 参数类型  | 结果                                                     |
| --------- | :------------------------------------------------------- |
| Undefined | "undefined"                                              |
| Null      | "null"                                                   |
| Boolean   | 如果参数是 true，返回 "true"。参数为 false，返回 "false" |
| Number    | 又是比较复杂，可以看例子                                 |
| String    | 返回与之相等的值                                         |

console.log(String(0)) // 0
console.log(String(-0)) // 0
console.log(String(NaN)) // NaN
console.log(String(Infinity)) // Infinity
console.log(String(-Infinity)) // -Infinity
console.log(String(1)) // 1

4. 原始值转对象

原始值到对象的转换非常简单，原始值通过调用 String()、Number() 或者 Boolean() 构造函数，转换为它们各自的包装对象。

null 和 undefined 属于例外，当将它们用在期望是一个对象的地方都会造成一个类型错误 (TypeError) 异常，而不会执行正常的转换。 5. 对象转布尔值
所有对象都转换为 true。包装对象也是这样。

6. 对象转换字符串和数字
   对象到字符串和对象到数字的转换都是通过调用待转换对象的一个方法来完成的。而 JavaScript 对象有两个不同的方法来执行转换，一个是 toString，一个是 valueOf。注意这个跟上面所说的 ToString 和 ToNumber 是不同的，这两个方法是真实暴露出来的方法。

所有的对象除了 null 和 undefined 之外的任何值都具有 toString 方法，通常情况下，它和使用 String 方法返回的结果一致。toString 方法的作用在于返回一个反映这个对象的字符串，然而这才是情况复杂的开始。

在上边判断 isPlainObject 中有，Object.prototype.toString 方法会根据这个对象的[[class]]内部属性，返回由 "[object " 和 class 和 "]" 三个部分组成的字符串。举个例子：

```js
Object.prototype.toString
    .call({ a: 1 })(
        // "[object Object]"
        { a: 1 },
    )
    .toString()(
    // "[object Object]"
    { a: 1 },
).toString === Object.prototype.toString; // true
```

我们可以看出当调用对象的 toString 方法时，其实调用的是 Object.prototype 上的 toString 方法。

然而 JavaScript 下的很多类根据各自的特点，定义了更多版本的 toString 方法。例如:

数组的 toString 方法将每个数组元素转换成一个字符串，并在元素之间添加逗号后合并成结果字符串。
函数的 toString 方法返回源代码字符串。
日期的 toString 方法返回一个可读的日期和时间字符串。
RegExp 的 toString 方法返回一个表示正则表达式直接量的字符串。

而另一个转换对象的函数是 valueOf，表示对象的原始值。默认的 valueOf 方法返回这个对象本身，数组、函数、正则简单的继承了这个默认方法，也会返回对象本身。日期是一个例外，它会返回它的一个内容表示: 1970 年 1 月 1 日以来的毫秒数。

```js
var date = new Date(2017, 4, 21);
console.log(date.valueOf()); // 1495296000000
```

接下来看对象到字符串是如何转换的?

在 toString 的对应表中加上对象的转换规则
|参数类型|结果|
|-|-|
|Object|1. primValue = ToPrimitive(input, String) 2. 返回 ToString(primValue).|

所谓的 ToPrimitive 方法，其实就是输入一个值，然后返回一个一定是基本类型的值。
我们总结一下，当我们用 String 方法转化一个值的时候，如果是基本类型，就参照 “原始值转字符” 这一节的对应表，如果不是基本类型，我们会将调用一个 ToPrimitive 方法，将其转为基本类型，然后再参照“原始值转字符” 这一节的对应表进行转换。

其实，从对象到数字的转换也是一样：
|参数类型|结果|
|-|-|
|Object|1. primValue = ToPrimitive(input, Number) 2. 返回 ToNumber(primValue).|
虽然转换成基本值都会使用 ToPrimitive 方法，但传参有不同，最后的处理也有不同，转字符串调用的是 ToString，转数字调用 ToNumber。

## ToPrimitive

那接下来就要看看 ToPrimitive 了，在了解了 toString 和 valueOf 方法后，这个也很简单。

让我们看规范 9.1，函数语法表示如下：

```js
ToPrimitive(input[, PreferredType])
```

第一个参数是 input，表示要处理的输入值。

第二个参数是 PreferredType，非必填，表示希望转换成的类型，有两个值可以选，Number 或者 String。

当不传入 PreferredType 时，如果 input 是日期类型，相当于传入 String，否则，都相当于传入 Number。

如果传入的 input 是 Undefined、Null、Boolean、Number、String 类型，直接返回该值。

如果是 ToPrimitive(obj, Number)，处理步骤如下：

1. 如果 obj 为 基本类型，直接返回
2. 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
3. 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
4. 否则，JavaScript 抛出一个类型错误异常。

如果是 ToPrimitive(obj, String)，处理步骤如下：

1. 如果 obj 为 基本类型，直接返回
2. 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
3. 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
4. 否则，JavaScript 抛出一个类型错误异常。

## 总结

### 对象转字符串

对象转字符串(就是 Number() 函数)可以概括为：

1. 如果对象具有 toString 方法，则调用这个方法。如果他返回一个原始值，JavaScript 将这个值转换为字符串，并返回这个字符串结果。
2. 如果对象没有 toString 方法，或者这个方法并不返回一个原始值，那么 JavaScript 会调用 valueOf 方法。如果存在这个方法，则 JavaScript 调用它。如果返回值是原始值，JavaScript 将这个值转换为字符串，并返回这个字符串的结果。
3. 否则，JavaScript 无法从 toString 或者 valueOf 获得一个原始值，这时它将抛出一个类型错误异常。

### 对象转数字

对象转数字的过程中，JavaScript 做了同样的事情，只是它会首先尝试 valueOf 方法

1. 如果对象具有 valueOf 方法，且返回一个原始值，则 JavaScript 将这个原始值转换为数字并返回这个数字
2. 否则，如果对象具有 toString 方法，且返回一个原始值，则 JavaScript 将其转换并返回。
3. 否则，JavaScript 抛出一个类型错误异常。

## JSON.stringify

[JSON.stringify](https://github.com/mqyqingfeng/Blog/issues/159)

## 隐式类型转换
