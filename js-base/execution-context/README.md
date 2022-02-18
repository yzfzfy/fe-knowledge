# 执行上下文

当执行一段代码时，会首先进行准备工作，这个工作就叫做执行上下文。

执行上下文栈来管理执行上下文

```js
ECStack = [];
```

当 Javascript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先会向执行上下文栈压入一个全局执行上下文，用 globalContext 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前，ECStack 最底部永远有个 globalContext.

```js
ECStack = [globalContext];
```

分析如下代码

```js
function fun3() {
    console.log('fun3');
}

function fun2() {
    fun3();
}

function fun1() {
    fun2();
}

fun1();
```

用伪代码模拟他的执行上下文变化过程就是

```js
// fun1()
ECStack.push(<fun1> functionContext);

// fun1中竟然调用了fun2，还要创建fun2的执行上下文
ECStack.push(<fun2> functionContext);

// 擦，fun2还调用了fun3！
ECStack.push(<fun3> functionContext);

// fun3执行完毕
ECStack.pop();

// fun2执行完毕
ECStack.pop();

// fun1执行完毕
ECStack.pop();

// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```

## 那执行上下文具体包括什么呢？

它包括三个重要属性：

-   变量对象(Variable object, VO)
-   作用域链(Scope chain)
-   this

## 变量对象

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。
全局上下文下的变量对象就是全局变量本身。

函数上下文的变量对象用活动对象(Acvation Object)来表示。其实就是一个东西，只有进入一个执行上下文中时，这个执行上下文的变量对象才会被激活，所以才叫 activation object。
活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

## 执行过程

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

1. 进入执行上下文
2. 代码执行

### 进入执行上下文

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)

    - 由名称和对应值组成的一个变量对象的属性被创建
    - 没有实参，属性值设为 undefined

2. 函数声明

    - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
    - 如果变量对象已经存在相同名称的属性，则完全替换这个属性

3. 变量声明

    - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
    - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举例：

```
当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

函数的所有形参 (如果是函数上下文)

由名称和对应值组成的一个变量对象的属性被创建
没有实参，属性值设为 undefined
函数声明

由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
如果变量对象已经存在相同名称的属性，则完全替换这个属性
变量声明

由名称和对应值（undefined）组成一个变量对象的属性被创建；
如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性
```

在进入执行上下文后，这时候的 AO 是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

### 代码执行

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

### 总结

1. 全局上下文的变量对象初始化是全局对象

2. 函数上下文的变量对象初始化只包括 Arguments 对象

3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值

4. 在代码执行阶段，会再次修改变量对象的属性值

## 作用域链

当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

js 采用静态作用域，即函数的作用域在函数定义的时候就决定了。

函数有一个内部属性`[[scope]]`当函数创建的时候，就有保存所有父变量对象到其中，可以理解`[[scope]]`就是所有父变量对象的层级链。（但是**[[scope]] 并不代表完整的作用域链！**）

举例：

```js
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的[[scope]]为：

```js
bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

## 函数激活

当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

## 详细过程

```js
var scope = 'global scope';
function checkscope() {
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```

1. checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

```js
checkscope.[[scope]] = [
    globalContext.VO
];
```

2. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```js
ECStack = [checkscopeContext, globalContext];
```

3. checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

```js
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4. 第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5.第三步：将活动对象压入 checkscope 作用域链顶端

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0,
        },
        scope2: undefined,
    },
    Scope: [AO, [[Scope]]],
};
```

6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0,
        },
        scope2: 'local scope',
    },
    Scope: [AO, [[Scope]]],
};
```

7.查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [globalContext];
```
