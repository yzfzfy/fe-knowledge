# 享元模式

## 定义

享元模式：运用共享技术有效的支持大量细粒度对象，避免对象之间拥有相同内容造成的不必要开销

主要用来优化程序的性能，适合解决大量类似的对象产生的性能问题。享元模式通过分析应用程序的对象，将其解析为内在数据和外在数据，减少对象数量，从而提高程序的性能。

当我们观察到代码中有大量相似的代码块，**_他们做的事情可能都是一样的，只是每次应用的对象不一样_**，我们就可以考虑用享元模式。

## 案例

[享元模式](https://github.com/Nealyang/YOU-SHOULD-KNOW-JS/blob/master/doc/design%20mode/%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F.md)

```js
// jquery的extend方法
// 1. 只有一个参数时，extend会将传入的参数合并到jQuery自己身上。
// 2. 传入两个参数obj1和obj2时，extend会将obj2合并到obj1上。

// 普通实现
$.extend = function () {
    if (arguments.length === 1) {
        for (var item in arguments[0]) {
            this[item] = arguments[0][item];
        }
    } else if (arguments.length === 2) {
        for (var item in arguments[1]) {
            arguments[0][item] = arguments[1][item];
        }
    }
};

// 这里的遍历对象和赋值对象有差异 其他都一样，所以可以抽象出来

$.extend = function () {
    // 不同的部分抽取出两个变量
    var target = this; // 默认为this，即$本身
    var source = arguments[0]; // 默认为第一个变量

    // 如果有两个参数, 改变target和source
    if (arguments.length === 2) {
        target = arguments[0];
        source = arguments[1];
    }

    // 共同的拷贝操作保持不变
    for (var item in source) {
        target[item] = source[item];
    }
};
```
