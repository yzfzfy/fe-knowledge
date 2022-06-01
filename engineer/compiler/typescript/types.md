# ts 类型

There are some additional types you’ll want to recognize that appear often when working with function types. Like all types, you can use them everywhere, but these are especially relevant in the context of functions.
有一些在为函数注解时经常会用到的类型，虽然他们可以在任何地方使用这些类型，但这在函数使用中尤其常见。

-   void

表示一个函数并不会返回任何值，当函数并没有任何返回值，或者返回不了明确的值的时候，就应该用这种类型。js 中如果一个函数没有返回值，那他隐含的会返回一个 undefined。但是在 ts 中 void 和 undefined 是不一样的。

-   object

在 ts 中 object 表示一个类型非原始类型(null undefined number string boolean symbol bigint)。也不同于和空对现象{}和 Object。Object 一般不会用到。比如在 ts 中，函数也是 object 类型。

-   never

一些函数从来不返回值：

```js
function fail(msg: string): never {
    throw new Error(msg);
}
```

never 类型表示一个值不会再被观察到 (observed)。

作为一个返回类型时，它表示这个函数会丢一个异常，或者会结束程序的执行。

当 TypeScript 确定在联合类型中已经没有可能是其中的类型的时候，never 类型也会出现：

```js
function fn(x: string | number) {
    if (typeof x === 'string') {
        // do something
    } else if (typeof x === 'number') {
        // do something else
    } else {
        x; // has type 'never'!
    }
}
```

[关于 never 类型的解释和使用](https://www.fullstackbb.com/typescript/never-type-in-typescript/)

-   unknown

unknown 类型可以表示任何值。有点类似于 any，但是更安全，因为对 unknown 类型的值做任何事情都是不合法的。可以用来描述一个可以接收任何值，但是在函数体中没有用到这个值的函数。

```ts
function safeParse(s: string): unknown {
    return JSON.parse(s);
}
```

-   函数重载

一个函数在调用时可以传入不同数量和类型的参数。例如一个函数返回 Date 对象，但是参数可能传入时间戳或者年月日的格式。此时就可以使用函数重载。说明一个函数的不同调用方法，需要写一些函数签名（两个或者更多）再写函数具体实现内容。

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    } else {
        return new Date(mOrTimestamp);
    }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);

// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
// 在函数声明实现中在一个required参数后，声明了两个可选参数，但是依然不能传入两个参数。
```

在函数体中签名对外部来说是不可见的，函数不能按照实现签名时定义的参数那样传入调用。所以在实现签名时，参数的定义要和重载的签名必须兼容。当函数调用时，调用方式必须对应上重载签名的几种之一。

不正确的例子

函数实现的签名参数不兼容重载的签名

```ts
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
// This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}
```

重载的函数返回值类型不兼容

```ts
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return "oops";
}
```

```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
    return x.length;
}

len(''); // OK
len([0]); // OK
len(Math.random() > 0.5 ? 'hello' : [0]); // 报错  原因：TypeScript 只能一次用一个函数重载处理一次函数调用。自己理解：ts做静态类型检查，不会认为?:是一个确定的值而是一个联合类型 'hello' | number[].
// 此时可以不使用函数重载而让函数的参数使用联合类型定义。
```

-   索引签名

有的时候，你不能提前知道一个类型里的所有属性的名字，但是你知道这些值的特征。
一个索引签名的属性类型必须是 string 或者是 number。
虽然 TypeScript 可以同时支持 string 和 number 类型，但数字索引的返回类型一定要是字符索引返回类型的子类型。

-   属性继承

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

=>
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}


interface AddressWithUnit extends BasicAddress {
  unit: string;
}


// 接口可以继承多个类型

interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

-   交叉类型
    交叉类型（Intersection types）用于合并已经存在的对象类型。

-   接口继承和交叉类型的区别

看起来很相似，最大的不同在于冲突怎么处理，你决定选择那种方式的主要原因。

```ts
interface Colorful {
  color: string;
}

interface ColorfulSub extends Colorful {
  color: number
}

// Interface 'ColorfulSub' incorrectly extends interface 'Colorful'.
// Types of property 'color' are incompatible.
// Type 'number' is not assignable to type 'string'.
// 接口继承有同名属性时，会报错

interface Colorful {
  color: string;
}

type ColorfulSub = Colorful & {
  color: number
}

// 交叉类型则不会报错，
此时的color的类型时never，取得是 string 和 number 的交集。
```

-   泛型

常见的 Array<string>，其实是使用泛型的表示法。说明 Array 本身是一个泛型

```ts
interface Array<Type> {
    /**
     * Gets or sets the length of the array.
     */
    length: number;

    /**
     * Removes the last element from an array and returns it.
     */
    pop(): Type | undefined;

    /**
     * Appends new elements to an array, and returns the new length of the array.
     */
    push(...items: Type[]): number;

    // ...
}
```

类似 Array，还有`Map<K, V>` ， `Set<T>` 和 `Promise<T>`。有一个`ReadonlyArray<T>`,描述数组不能被改变。其实就是`readonly string[]`

-   元组

元组类型是另外一种 Array 类型，当你明确知道数组包含多少个元素，并且每个位置元素的类型都明确知道的时候，就适合使用元组类型。

type StringNumberPair = [string, number];

在元组类型中，你也可以写一个可选属性，但可选元素必须在最后面，而且也会影响类型的 length 。

type Either2dOr3d = [number, number, number?];

元组类型也是可以设置 readonly 的：
function doSomething(pair: readonly [string, number]) {
// ...
}

在大部分的代码中，元组只是被创建，使用完后也不会被修改，所以尽可能的将元组设置为 readonly 是一个好习惯。
如果我们给一个数组字面量 const 断言，也会被推断为 readonly 元组类型

let point = [3, 4] as const;
