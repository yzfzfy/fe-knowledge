# 原型与继承

# 原型链

1. 字面量定义对象

```js
const a = {};
/*
 * 可认为是new Objet()生成的 a是Object构造函数的实例
 * a对象原型链：a == __proto__ ==> Object.prototype == __proto__ ==> null
 */
```

2. 自定义 class 实例化对象

```js
function Parent(age) {
  this.age = age;
}

const a = new Parent(13);

/*
 * 原型链 a == __proto__ ==> Parent.prototype == __proto__ ==> Object.prototype == __proto__ ==> null
 */
```

3. Array 也叫做数组对象。说明 b instanceof Object === true

```js
const a = [];

a.__proto__ === Array.prototype; // true 所以可认为a是通过 new Array()生成的

Array.prototype instanceof Object &&
  Array.prototype.__proto__ === Object.prototype;
// true 说明Array的原型是new Object生成的。只是new Object()生成数组对象时，相对于普通对象增加了数组特有的一些属性。
```

1. 函数：也叫函数对象，说明函数的原型链上也有 Object.prototype a instanceof Object === true

```js
function a() {}

a.__proto__ === Function.prototype  // 函数可看作是new Function()生成的

a instanceof Object === true && a instanceof Function === true &&  Object.__proto__ = Function.prototype
// 这里特殊说明 Object是Function的实例，所有函数都可以认为是Function的实例

Function.prototype  ===> ƒ () { [native code] }

```
