# 迭代器模式

## 定义

迭代器模式是指提供一种顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器分为两种，一种是内部迭代器，另外一种是外部迭代器

## 内部迭代器

内部迭代器在调用的时候非常方便，外界不用关心迭代器内部到底是如何实现的，跟迭代器的交互也只有一次初始调用，而这也正好是内部迭代器的缺点。

```js
// Jquery中的迭代器
$.each([1, 2, 3], function (index, value) {
    console.log(index);
    console.log(value);
});
```

## 外部迭代器

外部迭代器必须显示的请求迭代下一个元素

```js
// 自定义外部迭代器实现比较两个数组的值是否完全相等
var Iterator = function (obj) {
    var current = 0;
    var next = function () {
        current++;
    };
    var isDone = function () {
        return current >= obj.length;
    };
    var getCurrentItem = function () {
        return obj[current];
    };
    return {
        next: next,
        isDone: isDone,
        getCurrentItem: getCurrentItem,
        length: obj.length,
    };
};
var compare = function (iterator1, iterator2) {
    if (iterator1.length != iterator2.length) {
        console.log('两个数组不相等');
        return false;
    }
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrentItem() != iterator2.getCurrentItem()) {
            throw new Error('两个数组不相等');
        }
        iterator1.next();
        iterator2.next();
    }
    console.log('两个数组相等');
};
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 4]);
compare(iterator1, iterator2); // 报错，两个数组不相等
```
