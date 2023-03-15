## 其他 ts 语法

- 类型谓词 is

属于类型保护的范畴，一般会定义一个函数来判断某个联合类型的值是具体的某个类型，但是函数嵌套时返回一个布尔值 ts 并不能知道是否含有某个属性，这时候就在判断函数上返回值作为一个 parameterName is type.parameterName 是函数的参数名。当函数调用返回 true 时，ts 自动收窄 parameterName 为 type 类型。

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

- extends

用于条件判断

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

When the type on the left of the extends is assignable to the one on the right, then you’ll get the type in the first branch (the “true” branch); otherwise you’ll get the type in the latter branch (the “false” branch).当 extends 左边的类型可以被赋值到右边的类型时，将得到第一个分支的类型。否则第二个分支的类型。

当用到泛型时，这尤其有用。观察如下函数

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
  throw "unimplemented";
}
```

为了兼容函数的两种入参类型返回不同类型值，不得不为每种类型写函数重载，使用泛型后

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript"); // NameLabel

let b = createLabel(2.8); // IdLabel

let c = createLabel(Math.random() ? "hello" : 42); // NameLabel | IdLabel
```

- 函数调用签名

函数除了被掉用之外还可能会有其他属性，这时候就可以在一个对象类型上写一个调用签名。

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

当然函数还可以通过 new 作为构造函数调用，这时候可以在对象类型下添加构造签名来定义一个函数类型，

```ts
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

如果构造签名和调用签名同时存在（如 Date），可以同时写。**所以从这里看出，一个对象类型{}，可以用来表示一个函数的不同调用方式，不同参数类型的也可以这样表示**

```ts
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## ts 内置的使用泛型实现的高级类型

如：Omit、Pick、Parameters、ReturnType 等。更多在 typescript 库中 lib.es5.d.ts 文件查看。
