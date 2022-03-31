# 数组

javascript 数组就是常用的数据方法的内容。

## 使用

-   使用数组数组斐波那契数列的前 20 项。

```js
const fibonacci = [];
fibonacci[0] = 1;
fibonacci[1] = 1;

for (let i = 2; i < 20; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
}

console.log(fibonacci);
```

-   sort 方法。sort 方法会默认每项是一个字符串，然后比较它们的 UTF-16 代码单元值序列时构建的

arr.sort((firstEl, secondEl) => {})

比较规则:

-   如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
-   如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。备注： ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；
-   如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。
-   必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。

所以比较规则是这样的

```js
function compare(a, b) {
    if (a < b) {
        // 按某种排序标准进行比较, a 小于 b
        return -1;
    }
    if (a > b) {
        return 1;
    }
    // a must be equal to b
    return 0;
}
// 简化为就是这样
function compareNumbers(a, b) {
    return a - b;
}
```

加入根据对象中某个 key 的值进行排序，那就是自定义排序

```js
var friends = [
    { name: 'John', age: 30 },
    { name: 'Ana', age: 20 },
    { name: 'Chris', age: 25 },
];
function comparePerson(a, b) {
    if (a.age < b.age) {
        return -1;
    }
    if (a.age > b.age) {
        return 1;
    }
    return 0;
}
console.log(friends.sort(comparePerson));
```
