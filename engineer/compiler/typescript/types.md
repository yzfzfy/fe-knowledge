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

-   泛型(Generic)

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

一个使用函数的泛型如

```ts
function identity<Type>(arg: Type): Type {
    return arg;
}
```

一种可以捕获参数类型的方式，然后再用它表示返回值的类型。这里我们用了一个类型变量（type variable），一种用在类型而非值上的特殊的变量。

    -   泛型类

泛型类写法上类似于泛型接口。在类名后面，使用尖括号中 <> 包裹住类型参数列表：

```ts
class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
    return x + y;
};
```

一个类它的类型有两部分：静态部分和实例部分。泛型类仅仅对实例部分生效，所以当我们使用类的时候，注意静态成员并不能使用类型参数。

    -   在泛型约束中使用类型参数

你可以声明一个类型参数，这个类型参数被其他类型参数约束。

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a');
getProperty(x, 'm');

// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

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

-   keyof 类型操作符

对一个**对象类型**使用 keyof 操作符，会返回该对象属性名组成的一个字符串或者数字字面量的联合。这个例子中的类型 P 就等同于 "x" | "y"：

```ts
type Point = { x: number; y: number };
type P = keyof Point;

// type P = keyof Point
// 注意这里的Point是一个类型，keyof作用在类型上
```

-   数字字面量联合类型

keyof 也可能返回一个数字字面量的联合类型，

```ts
const NumericObject = {
    [1]: '冴羽一号',
    [2]: '冴羽二号',
    [3]: '冴羽三号',
};

type result = keyof typeof NumericObject;

// typeof NumbericObject 的结果为：
// {
//   1: string;
//   2: string;
//   3: string;
// }
// 所以最终的结果为：
// type result = 1 | 2 | 3
```

-   Symbol

TypeScript 也可以支持 symbol 类型的属性名：

```ts
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

const symbolToNumberMap = {
    [sym1]: 1,
    [sym2]: 2,
    [sym3]: 3,
};

type KS = keyof typeof symbolToNumberMap; // typeof sym1 | typeof sym2 | typeof sym3
```

这也就是为什么当我们在泛型中像下面的例子中使用，会如此报错：

```ts
function useKey<T, K extends keyof T>(o: T, k: K) {
    var name: string = k;
    // Type 'string | number | symbol' is not assignable to type 'string'.
}
```

如果你确定只使用字符串类型的属性名，你可以这样写：

```ts
function useKey<T, K extends Extract<keyof T, string>>(o: T, k: K) {
    var name: string = k; // OK
}
```

而如果你要处理所有的属性名，你可以这样写

```ts
function useKey<T, K extends keyof T>(o: T, k: K) {
    var name: string | number | symbol = k;
}
```

-   typeof 类型操作符

如果仅仅用来判断基本的类型，自然是没什么太大用，和其他的类型操作符搭配使用才能发挥它的作用。

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
/// type K = boolean
```

如果我们直接对一个函数名使用 ReturnType ，我们会看到这样一个报错：

```ts
function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<f>;

// 'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
```

这是因为值（values）和类型（types）并不是一种东西。为了获取值 f 也就是函数 f 的类型，我们就需要使用 typeof：

```ts
function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;

// type P = {
//    x: number;
//    y: number;
// }
```

在 TypeScript 中，只有对标识符（比如变量名）或者他们的属性使用 typeof 才是合法的。这可能会导致一些令人迷惑的问题：

```ts
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
// ',' expected.
```

我们本意是想获取 msgbox("Are you sure you want to continue?") 的返回值的类型，所以直接使用了 typeof msgbox("Are you sure you want to continue?")，看似能正常执行，但实际并不会，这是因为 typeof 只能对标识符和属性使用。而正确的写法应该是：

```ts
ReturnType<typeof msgbox>
```

对对象使用 typeof

```ts
const person = { name: 'kevin', age: '18' };
type Kevin = typeof person;

// type Kevin = {
// 		name: string;
// 		age: string;
// }
```

对函数使用 typeof

```ts
function identity<Type>(arg: Type): Type {
    return arg;
}

type result = typeof identity;
// type result = <Type>(arg: Type) => Type
```

对 enum 使用 typeof

在 TypeScript 中，enum 是一种新的数据类型，但在具体运行的时候，它会被编译成对象。

```ts
enum UserResponse {
    No = 0,
    Yes = 1,
}
```

对应编译的 JavaScript 代码为：

```ts
var UserResponse;
(function (UserResponse) {
    UserResponse[(UserResponse['No'] = 0)] = 'No';
    UserResponse[(UserResponse['Yes'] = 1)] = 'Yes';
})(UserResponse || (UserResponse = {}));
```

如果我们打印一下 UserResponse：

```ts
console.log(UserResponse);

// [LOG]: {
//   "0": "No",
//   "1": "Yes",
//   "No": 0,
//   "Yes": 1
// }
```

而如果我们对 UserResponse 使用 typeof：

```ts
type result = typeof UserResponse;

// ok
const a: result = {
      "No": 2,
      "Yes": 3
}

result 类型类似于：

// {
//	"No": number,
//  "YES": number
// }
```

不过对一个 enum 类型只使用 typeof 一般没什么用，通常还会搭配 keyof 操作符用于获取属性名的联合字符串：

```ts
type result = keyof typeof UserResponse;
// type result = "No" | "Yes"
```

-   索引访问类型
    我们可以使用 索引访问类型（indexed access type） 查找另外一个类型上的特定属性：

```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person['age'];
// type Age = number
```

因为索引名本身就是一个类型，所以我们也可以使用联合、keyof 或者其他类型：

```ts
type I1 = Person['age' | 'name'];
// type I1 = string | number

type I2 = Person[keyof Person];
// type I2 = string | number | boolean

type AliveOrName = 'alive' | 'name';
type I3 = Person[AliveOrName];
// type I3 = string | boolean
```

如果你尝试查找一个不存在的属性，TypeScript 会报错：

```ts
type I1 = Person['alve'];
// Property 'alve' does not exist on type 'Person'.
```

作为索引的只能是类型，这意味着你不能使用 const 创建一个变量引用：

```ts
const key = 'age';
type Age = Person[key];

// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
```

然而你可以使用类型别名实现类似的重构：

```ts
type key = 'age';
type Age = Person[key];
```

一个页面要用在不同的 APP 里，比如淘宝、天猫、支付宝，根据所在 APP 的不同，调用的底层 API 会不同，我们可能会这样写：

```ts
const APP = ['TaoBao', 'Tmall', 'Alipay'];

function getPhoto(app: string) {
    // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // ok
```

如果我们仅仅是对 app 约束为 string 类型，即使传入其他的字符串，也不会导致报错，我们可以使用字面量联合类型约束一下：

```ts
const APP = ['TaoBao', 'Tmall', 'Alipay'];
type app = 'TaoBao' | 'Tmall' | 'Alipay';

function getPhoto(app: app) {
    // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```

但写两遍又有些冗余，我们怎么根据一个数组获取它的所有值的字符串联合类型呢？我们就可以结合上一篇的 typeof 和本节的内容实现：

```ts
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

function getPhoto(app: app) {
    // ...
}

getPhoto('TaoBao'); // ok
getPhoto('whatever'); // not ok
```

我们来一步步解析：
首先是使用 as const 将数组变为 readonly 的元组类型：

```ts
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
// const APP: readonly ["TaoBao", "Tmall", "Alipay"]
```

但此时 APP 还是一个值，我们通过 typeof 获取 APP 的类型：

```ts
type typeOfAPP = typeof APP;
// type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]
```

最后在通过索引访问类型，获取字符串联合类型：

```ts
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"
```

-   条件类型（Conditional Types）
    很多时候，我们需要基于输入的值来决定输出的值，同样我们也需要基于输入的值的类型来决定输出的值的类型。条件类型（Conditional types）就是用来帮助我们描述输入类型和输出类型之间的关系。

```ts
interface Animal {
    live(): void;
}

interface Dog extends Animal {
    woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
// type Example1 = number

type Example2 = RegExp extends Animal ? number : string;
// type Example2 = string
```

条件类型的写法有点类似于 JavaScript 中的条件表达式（condition ? trueExpression : falseExpression ）：

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

单从这个例子，可能看不出条件类型有什么用，但当搭配泛型使用的时候就很有用了，让我们拿下面的 createLabel 函数为例：

```ts
interface IdLabel {
    id: number /* some fields */;
}
interface NameLabel {
    name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
    throw 'unimplemented';
}
```

这里使用了函数重载，描述了 createLabel 是如何基于输入值的类型不同而做出不同的决策，返回不同的类型。注意这样一些事情：

如果一个库不得不在一遍又一遍的遍历 API 后做出相同的选择，它会变得非常笨重。
我们不得不创建三个重载，一个是为了处理明确知道的类型，我们为每一种类型都写了一个重载（这里一个是 string，一个是 number），一个则是为了通用情况 （接收一个 string | number）。而如果增加一种新的类型，重载的数量将呈指数增加。

其实我们完全可以用把逻辑写在条件类型中：

```ts
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
```

使用这个条件类型，我们可以简化掉函数重载：

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw 'unimplemented';
}

let a = createLabel('typescript');
// let a: NameLabel

let b = createLabel(2.8);
// let b: IdLabel

let c = createLabel(Math.random() ? 'hello' : 42);
// let c: NameLabel | IdLabel
```

-   条件类型约束 （Conditional Type Constraints）
    通常，使用条件类型会为我们提供一些新的信息。正如使用 类型保护（type guards） 可以 收窄类型（narrowing） 为我们提供一个更加具体的类型，条件类型的 true 分支也会进一步约束泛型，举个例子：

```ts
type MessageOf<T> = T['message'];
// Type '"message"' cannot be used to index type 'T'.
```

TypeScript 报错是因为 T 不知道有一个名为 message 的属性。我们可以约束 T，这样 TypeScript 就不会再报错：

```ts
type MessageOf<T extends { message: unknown }> = T['message'];

interface Email {
    message: string;
}

type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string
```

但是，如果我们想要 MessgeOf 可以传入任何类型，但是当传入的值没有 message 属性的时候，则返回默认类型比如 never 呢？

我们可以把约束移出来，然后使用一个条件类型：

```ts
type MessageOf<T> = T extends { message: unknown } ? T['message'] : never;

interface Email {
    message: string;
}

interface Dog {
    bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string

type DogMessageContents = MessageOf<Dog>;
// type DogMessageContents = never
```

在 true 分支里，TypeScript 会知道 T 有一个 message 属性。

再举一个例子，我们写一个 Flatten 类型，用于获取数组元素的类型，当传入的不是数组，则直接返回传入的类型：

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;
// type Str = string

// Leaves the type alone.
type Num = Flatten<number>;
// type Num = number
```

注意这里使用了索引访问类型 里的 number 索引，用于获取数组元素的类型。

-   在条件类型里推断（Inferring Within Conditional Types）

条件类型提供了 infer 关键词，可以从正在比较的类型中推断类型，然后在 true 分支里引用该推断结果。借助 infer，我们修改下 Flatten 的实现，不再借助索引访问类型“手动”的获取出来：

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

这里我们使用了 infer 关键字声明了一个新的类型变量 Item ，而不是像之前在 true 分支里明确的写出如何获取 T 的元素类型，这可以解放我们，让我们不用再苦心思考如何从我们感兴趣的类型结构中挖出需要的类型结构。

我们也可以使用 infer 关键字写一些有用的 类型帮助别名（helper type aliases）。举个例子，我们可以获取一个函数返回的类型：

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;

type Num = GetReturnType<() => number>;
// type Num = number

type Str = GetReturnType<(x: string) => string>;
// type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
// type Bools = boolean[]
```

-   分发条件类型（Distributive Conditional Types）

当在泛型中使用条件类型的时候，如果传入一个联合类型，就会变成 分发的（distributive），举个例子：

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
```

如果我们在 ToArray 传入一个联合类型，这个条件类型会被应用到联合类型的每个成员：

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```

让我们分析下 StrArrOrNumArr 里发生了什么，这是我们传入的类型：

```ts
string | number;
```

接下来遍历联合类型里的成员，相当于：

```ts
ToArray<string> | ToArray<number>;
```

所以最后的结果是：string[] | number[];
通常这是我们期望的行为，如果你要避免这种行为，你可以用方括号包裹 extends 关键字的每一部分。

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```

-   映射类型（Mapped Types）

有的时候，一个类型需要基于另外一个类型，但是你又不想拷贝一份，这个时候可以考虑使用映射类型。

映射类型建立在索引签名的语法上，我们先回顾下索引签名：

```ts
// 当你需要提前声明属性的类型时
type OnlyBoolsAndHorses = {
    [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
    del: true,
    rodney: false,
};
```

而映射类型，就是使用了 PropertyKeys 联合类型的泛型，其中 PropertyKeys 多是通过 keyof 创建，然后循环遍历键名创建一个类型：

```ts
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
};
```

在这个例子中，OptionsFlags 会遍历 Type 所有的属性，然后设置为布尔类型。

```ts
type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//    darkMode: boolean;
//    newUserProfile: boolean;
// }
```

-   映射修饰符（Mapping Modifiers）

在使用映射类型时，有两个额外的修饰符可能会用到，一个是 readonly，用于设置属性只读，一个是 ? ，用于设置属性可选。

你可以通过前缀 - 或者 + 删除或者添加这些修饰符，如果没有写前缀，相当于使用了 + 前缀。

```ts
// 删除属性中的只读属性
type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
    readonly id: string;
    readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;

// type UnlockedAccount = {
//    id: string;
//    name: string;
// }
```

```ts
// 删除属性中的可选属性
type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
    id: string;
    name?: string;
    age?: number;
};

type User = Concrete<MaybeUser>;
// type User = {
//    id: string;
//    name: string;
//    age: number;
// }
```

-   通过 as 实现键名重新映射（Key Remapping via as）

在 TypeScript 4.1 及以后，你可以在映射类型中使用 as 语句实现键名重新映射：

```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

举个例子，你可以利用「模板字面量类型」，基于之前的属性名创建一个新属性名：

```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;

// type LazyPerson = {
//    getName: () => string;
//    getAge: () => number;
//    getLocation: () => string;
// }
```

你也可以利用条件类型返回一个 never 从而过滤掉某些属性:

```ts
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property];
};

interface Circle {
    kind: 'circle';
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

// type KindlessCircle = {
//    radius: number;
// }
```

你还可以遍历任何联合类型，不仅仅是 string | number | symbol 这种联合类型，可以是任何类型的联合：

```ts
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E['kind']]: (event: E) => void;
};

type SquareEvent = { kind: 'square'; x: number; y: number };
type CircleEvent = { kind: 'circle'; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
// type Config = {
//    square: (event: SquareEvent) => void;
//    circle: (event: CircleEvent) => void;
// }
```

-   深入探索（Further Exploration）

映射类型也可以跟其他的功能搭配使用，举个例子，这是一个使用条件类型的映射类型，会根据对象是否有 pii 属性返回 true 或者 false :

```ts
type ExtractPII<Type> = {
    [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
    id: { format: 'incrementing' };
    name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
// type ObjectsNeedingGDPRDeletion = {
//    id: false;
//    name: true;
// }
```

-   模板字面量类型（Template Literal Types）

模板字面量类型以字符串字面量类型为基础，可以通过联合类型扩展成多个字符串。

它们跟 JavaScript 的模板字符串是相同的语法，但是只能用在类型操作中。当使用模板字面量类型时，它会替换模板中的变量，返回一个新的字符串字面量：

```ts
type World = 'world';

type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

当模板中的变量是一个联合类型时，每一个可能的字符串字面量都会被表示：

```ts
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

如果模板字面量里的多个变量都是联合类型，结果会交叉相乘，比如下面的例子就有 2 _ 2 _ 3 一共 12 种结果：

```ts
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = 'en' | 'ja' | 'pt';

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
```

-   类型中的字符串联合类型（String Unions in Types）

[例子](https://github.com/mqyqingfeng/Blog/issues/231)

-   类

[文档](https://github.com/mqyqingfeng/Blog/issues/232)
[文档](https://github.com/mqyqingfeng/Blog/issues/233)


```ts

```

```ts

```

```ts

```

```ts

```
