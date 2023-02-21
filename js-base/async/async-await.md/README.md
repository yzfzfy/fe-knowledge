# async await

[asyn 函数是 Generator 函数的语法糖。](https://es6.ruanyifeng.com/#docs/async#%E5%90%AB%E4%B9%89)

## 用法

```js
async function func(params) {
  const res1 = await a(params);
  const res2 = await b(res1);

  return res2;
}
```

## 与 generator 区别

写法上很像 generator 函数。（async 对应\*，await 对应 yield）
只不过通过()执行后，async 函数可以直接返回结果，generator()执行后返回的是一个遍历器对象，
每次还需要执行.next()方法才可以得到值。总结就是 async 函数内部是有自动执行机制

## 执行过程

### async 作为函数前缀就表明该函数中有异步操作，函数返回值为一个 promise 实例。

如果函数中一条命令需要依靠另外一个异步操作的结果才可往下，则需要用 await，等待 promise 完成(并且状态必须是 fulfilled,为 rejected 则该 async 后的代码不会执行，且返回的 promise 也是 rejected)后，下一步才会继续往下执行。

1. 如果 async 中的 return 值为一个非 promise 实例，则 async 返回的结果会用 Promise.resolve 包裹该值后，返回 promise

2. 如果 return 的值为一个 promise，则 async 的返回值是该 promise 实例。

3. 函数中的 await 后的值是一个 promise，只有该 promise 的值为 fulfilled 后 async 才可继续往下执行，如果 await 后是一个非 promise 实例，则像第 2 点一样，也会把其后的值用 Promise.resolve 包裹一下。
