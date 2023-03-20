## interface 与 type 的异同点。

interface: 接口。是用来定义来用于定义对象类型的，可以对对象的形状进行描述。

type: 类型别名。顾名思义它并不是一个类型，只是一个别名而已。就像 webpack 的 alias 配置，只是为了方便书写使用。

### 共同点：

1. 都可以定义一个对象或者函数。

定义函数：

```ts
type addType = (num1: number, num2: number) => number;

interface addType {
    (num1: number, num2: number): number;
}
这两种写法都可以定义函数类型;
```

2. 都允许继承（extends）

但是实现继承的方式不同。

interface 互相继承

```ts
interface Person {
    name: string;
}
interface Student extends Person {
    grade: number;
}
```

interface 继承 type

```ts
type Person = {
    name: string;
};

interface Student extends Person {
    grade: number;
}
```

type 继承 type

```ts
type Person = {
    name: string;
};
type Student = Person & { grade: number };
```

type 继承 interface 通过使用交叉类型

```ts
interface Person {
    name: string;
}

type Student = Person & { grade: number };
```

### 不同点

type 可以但是 interface 不可以的。

_类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。_

声明基本类型、联合类型、交叉类型、元组

```ts
type Name = string; // 基本类型

type arrItem = number | string; // 联合类型

const arr: arrItem[] = [1, "2", 3];

type Person = {
    name: Name;
};

type Student = Person & { grade: number }; // 交叉类型

type Teacher = Person & { major: string };

type StudentAndTeacherList = [Student, Teacher]; // 元组类型

const list: StudentAndTeacherList = [
    { name: "lin", grade: 100 },
    { name: "liu", major: "Chinese" },
];
```

interface 可以但是 type 不可以的

合并重复声明

```ts
interface Person {
    name: string;
}

interface Person {
    // 重复声明 interface，就合并了
    age: number;
}

const person: Person = {
    name: "lin",
    age: 18,
};
```

interface 重复声明会自动合并，但是 type 不行，会报错。

```ts
type Person = {
    name: string;
};

type Person = {
    age: number;
};

const person: Person = {
    name: "lin",
    age: 18,
};
```

## 相关链接

[interfaces-vs-types-in-typescript](https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript)
