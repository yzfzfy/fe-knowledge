# 严格模式

顾名思义就是让 js 在严格的条件下执行。

## 如何开启严格模式

通过在脚本或函数的头部添加 `'use strict'`表达式来声明.

## 为什么要使用严格模式

消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为;具体如下

-   消除代码运行的一些不安全之处，保证代码运行的安全
-   提高编译器效率，增加运行速度
-   为未来新版本的 js 做好铺垫

可以看出严格模式是为了 js 更合理、更安全、更严谨。

## 举例

1. 不允许使用未声明的变量

```js
'use strict';
x = 3.14; // 报错 (x 未定义)
```

2. 不允许删除变量或对象。

```js
'use strict';
var x = 3.14;
delete x; // 报错
```

3. 不允许对只读属性赋值、不允许删除一个不允许删除的属性

```js
'use strict';
var obj = {};
Object.defineProperty(obj, 'x', { value: 0, writable: false });

obj.x = 3.14; // 报错

('use strict');
delete Object.prototype; // 报错
```

4. 变量名不能使用 "eval" 字符串或其他保留关键字:
   `implements` 、`interface` 、`let` 、`package` 、`private` 、`protected` 、`public`、 `static`、`yield`

```js
'use strict';
var eval = 3.14; // 报错
```

5. 禁止 this 指向全局对象

```js
function f() {
    'use strict';
    this.a = 1;
}
f(); // 报错，this未定义
```
