# 斐波那契数列问题

当前项的值都是前一项的值和前两项的值的相加,求第 n 项的值。
求第 n 项就是求第 n-1 项和第 n-2 项的值。即 f(n)=f(n-1)+f(n-2)

-   思路一: 递归法 接收参数 n，简化成求 n-1 和 n-2 的值

```js
function fibonacci(n) {
    if (n === 1 || n === 2) {
        return 1;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

-   数组法 叫动态规划法
