# generator 函数 与遍历器

## generator 书写&使用

```js
function* gen() {
    yield 1;
    yield 1;
    yield 1;
}

const it = gen();

it.next();
```

## 特点

-   状态机 保存了一个个状态
-   在常规函数基础上加\*和 yield 抛出状态
-   执行后和常规函数执行结果相比,并不是函数 return 的值,而是一个遍历器函数,所以并**不能直接执行**
-   想要得到其中的状态值，需要执行 it.next(),执行一次得到一个内部状态值.
-   it.next()执行时，generator 内部遇到 yield 语句就停止执行.next 的参数就是上次 yield 执行的结果，如果不传该参数，那么该 yield 字段就没有返回值。如果 yield 左侧有赋值则为 undefined;
-   想要一次性把 ge 内部的值都返回就需要有一个自动执行机制，直到 done 为 true。

```js
// 简易模拟co模块自动执行机制
function co(g) {
    const iterator = g();
    let fi = null;

    function spawn() {
        let res = iterator.next(2);

        if (!res.done) {
            spawn();
        } else {
            fi = res.value;
        }
    }

    spawn();

    return fi;
}
```

-   保存的一系列的值和数组的遍历得到所有的值很相似，所以需要了解数组是怎么遍历的。

## 数组（或可遍历结构）的遍历

### 遍历器接口

**在数组对象的原型上有一个函数属性 Symbol.iterator**;它的值就是遍历器生成函数，generator 函数就是遍历器生成函数。
for...of 可以循环出数组的每项值，正是因为有该属性在数组原型上。可以理解为：如果一个对象可遍历，那么他需要具备一个 Symbol.iterator 属性。（个人理解在 for...of 遍历时，会自动执行该方法，然后自动执行该方法 next，把返回的遍历器 value 一个个返回）;同时**for...of 也支持遍历遍历器生成函数执行后返回的遍历器。**（个人理解是因为遍历器除了可以执行 next 方法外，还可以作为普通函数调用，调用返回值还是它本身，所以相当于自身也是一个遍历器生成函数，所以可遍历）。
