# promise

## 异步编程方案

之前 callback 实现的，有回调地狱的风险。嵌套越来越深。有了 promise 之后，success 和 fail 回调在对应的实例上都有方法。如 ajax 是靠传入 callback 执行的，在请求成功或失败时，会将回调推入调用栈，等待 js 引擎空闲时执行，promise 其实一样的道理，初始化是就同步传入成功和失败回调，等待 promise 状态改变时执行。

## 用法

```js
// 在初始化实例时，传入的函数参数是为了告诉程序该promise实例的状态改变的逻辑是什么。
// promise只是一个空壳子，具体怎么改变状态都是靠自己传入的。只不过promise规定会为函数
// 传入两个参数，两个参数都是函数参数，你利用这两个参数改变promise状态。
const promiseA = new Promise((resolve, reject) => {
  if (true) {
    resolve();
  } else {
    reject();
  }
});

promiseA.then();
promiseA.catch();
```

## promise 的状态

- fulfilled: 成功
- rejected: 拒绝
- promise 状态改变后，就不可再次改变。resolve 或 reject 只能执行一次。这意味着**多次执行 then 或 catch 的结果是相同的**

## 手动实现一个 Promise 类

```ts
class Promise {
  // 状态
  status = "pending";
  value = null;
  // then执行时还在pending状态，那就需要先存起来等到resolve后再执行。
  // 都在pending状态，所以需要一个存多个回调的函数数组
  callbacks = [];

  // 初始化时参数为函数参数
  constructor(func) {
    func(this.resolve.bind(this), this.reject);
  }

  // resolve和reject执行的时候允许传一个值
  resolve(data) {
    // resolve执行的时候，对于promise实例内部来说是改变状态和值。
    this.status = "fulfilled";
    this.value = data;

    // 在promise resolve之前如果有个then方法执行过，则需要执行一次回调数组

    callbacks.forEach((callback) => {
      const result = callback(this.value);
      // 这里执行每个callback后，需要把之前push回调时候的那个promise的resolve执行一下
      // 但是这里没有把resolve传进来，需要优化。优化后逻辑在下一版。
      // resolve(result);
    });
  }

  reject(data) {
    this.status = "rejected";
    this.value = data;
  }

  then(resolveFn) {
    // 因为使用时可以对promise实例多次执行then方法，所以每次

    // then执行时，promise的状态两种都可能
    // 1.then执行时已经resolve
    if (this.status === "fulfilled") {
      // 支持链式操作，所以需要返回一个新的promise。并且该promise的状态是resolveFn的返回值
      return new Promise((resolve, reject) => {
        const result = resolveFn(this.value);
        resolve(result);
      });
    }

    // 2.执行时还在pending状态，那就需要先存起来等到resolve后再执行。
    // 都在pending状态，所以需要初始化一个存多个回调的函数数组
    if (this.status === "pending") {
      return new Promise((resolve) => {
        this.callbacks.push(resolveFn);
      });
    }
  }

  catch(rejectFn) {}
}
```

对上一版优化一下，把公共的处理 then 中的逻辑抽象成为一个实例方法

```ts
interface IhandleParams {
  // 这是then返回的那个promise的resolve函数
  resolve: () => {};
  // 这是本promise通过then注入的回调
  onFulfilled: () => {};
}

class Promise {
  // 状态
  status = "pending";
  value = null;
  // then执行时还在pending状态，那就需要先存起来等到resolve后再执行。
  // 都在pending状态，所以需要一个存多个回调的函数数组
  callbacks: IhandleParams[] = [];

  // 初始化时参数为函数参数
  constructor(func) {
    func(this.resolve.bind(this), this.reject.bind(this));
  }

  _handle(payload: IhandleParams) {
    if (this.status === "pending") {
      this.callbacks.push(payload);

      return;
    }

    const cb =
      this.status === "fulfilled" ? payload.onFulfilled : payload.onRejected();

    // then中可能没有传对应的处理函数，则交给链级下一级操作。如：then第二个函数即catch没有
    // 传，则可能catch是在链式的下一个。
    if (!cb) {
      cb = this.status === "fulfilled" ? payload.resolve : payload.reject;
      cb(this.value);

      return;
    }

    const result = cb(this.value);

    // then返回的的promise的resolve执行
    payload.resolve(result);
  }

  // resolve和reject执行的时候允许传一个值
  resolve(data) {
    // 这里是onFulfilled 返回值是 promise的情况。通过 onFulfilled，由使用 Promise 的开发者决定后续 Promise 的状态。
    // if (value && (typeof value === 'object' || typeof value === 'function')) {
    //     const then = value.then;
    //     if (typeof then === 'function') {
    //         then.call(data, this._resolve.bind(this));
    //         return;
    //     }
    // }

    // resolve执行的时候，对于promise实例内部来说是改变状态和值。
    this.status = "fulfilled";
    this.value = data;

    // 在promise resolve之前如果有个then方法执行过，则需要执行一次回调数组

    this.callbacks.forEach((callback) => this._handle(callback));
  }

  reject(error) {
    this.state = "rejected";
    this.value = error;
    this.callbacks.forEach((callback) => this._handle(callback));
  }

  then(onFulfilled, onRejected) {
    // then执行时，promise的状态两种都可能

    // // 1.then执行时已经resolve
    // if (this.status === 'fulfilled') {
    //     // 支持链式操作，所以需要返回一个新的promise。并且该promise的状态是resolveFn的返回值
    //     return new Promise((resolve, reject) => {
    //         const result = resolveFn(this.value);
    //         resolve(result);
    //     });
    // }

    // // 2.执行时还在pending状态，那就需要先存起来等到resolve后再执行。
    // // 都在pending状态，所以需要初始化一个存多个回调的函数数组
    // if (this.status === 'pending') {
    //     return new Promise((resolve) => {
    //         this.callbacks.push(resolveFn);
    //     });
    // }

    // 上边的逻辑放到handle中区分处理

    return new Promise((resolve, reject) => {
      this._handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  }

  catch(onRejected) {
    // 对于catch可认为是第一个参数为null的处理
    return this.then(null, onError);
  }

  // 只要promise状态改变就需要执行，并且finally不需要关心状态是啥，所以函数不需要参数
  finally(onDone) {
    // 这里执行then是不改变本promise的状态
    if (typeof onDone !== "function") return this.then();
    let Promise = this.constructor;
    return this.then(
      (value) => Promise.resolve(onDone()).then(() => value),
      (reason) =>
        Promise.resolve(onDone()).then(() => {
          throw reason;
        })
    );
  }
}
```

## Promise 的静态方法

### Promise.resolve 和 Promise.reject

```ts
// Promise.resolve的特性：1 如果参数是一个promise，将原封不动的返回该实例
// 2.如果参数是thenable 对象，会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 、// then方法。3.不是具有 then 方法的对象，或根本就不是对象.返回一个新的 Promise 对象，状态为 resolved。4. 不带参数时，直接返回一个 resolved 状态的 Promise 对象。
static resolve(value) {
    if (value && value instanceof Promise) {
        return value;
    } else if (value && typeof value === 'object' && typeof value.then === 'function') {
        let then = value.then;
        return new Promise(resolve => {
            then(resolve);
        });
    } else if (value) {
        return new Promise(resolve => resolve(value));
    } else {
        return new Promise(resolve => resolve());
    }
}

reject与resolve类似，始终返回一个状态为reject的promise
```

### Promise.race 与 Promise.all

```ts
// 特性：传入一个promise数组，等到所有promise都resolve后返回一个promise
static all(promises) {
    return new Promise((resolve, reject) => {
        let fulfilledCount = 0
        const itemNum = promises.length
        const rets = Array.from({ length: itemNum })
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(result => {
                fulfilledCount++;
                rets[index] = result;
                if (fulfilledCount === itemNum) {
                    resolve(rets);
                }
                // 这里注意只要有一个promise状态为reject就失败
            }, reason => reject(reason));
        })
    })
}

// 第一个改变状态（不管时成功或失败）的promise的状态就是race的状态
static race(promises) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(function (value) {
                return resolve(value)
            }, function (reason) {
                return reject(reason)
            })
        }
    })
}
```
