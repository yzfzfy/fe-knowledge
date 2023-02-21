# Tapable

> Just a little module for plugins.

## webpack 中初始化 hook

hooks 中列出了 webpack 各个生命周期的勾子。每个 hook 都是 tapable 导出的 hook 类的实例。实例化 hook 时，传入了一个数组参数。这里以 failed 为例: new SyncHook(['error']);

```js
const {
	Tapable,
	SyncHook,
	SyncBailHook,
	AsyncParallelHook,
	AsyncSeriesHook
} = require("tapable");
...
...
// compiler.js构造函数
constructor(context) {
    super();
    this.hooks = {

        additionalPass: new AsyncSeriesHook([]),
        beforeRun: new AsyncSeriesHook(["compiler"]),
        run: new AsyncSeriesHook(["compiler"]),
        emit: new AsyncSeriesHook(["compilation"]),
        assetEmitted: new AsyncSeriesHook(["file", "content"]),
        afterEmit: new AsyncSeriesHook(["compilation"]),

        thisCompilation: new SyncHook(["compilation", "params"]),
        compilation: new SyncHook(["compilation", "params"]),
        normalModuleFactory: new SyncHook(["normalModuleFactory"]),
        contextModuleFactory: new SyncHook(["contextModulefactory"]),

        beforeCompile: new AsyncSeriesHook(["params"]),
        compile: new SyncHook(["params"]),
        make: new AsyncParallelHook(["compilation"]),
        afterCompile: new AsyncSeriesHook(["compilation"]),

        watchRun: new AsyncSeriesHook(["compiler"]),
        failed: new SyncHook(["error"]),
        invalid: new SyncHook(["filename", "changeTime"]),
        watchClose: new SyncHook([]),
    };
}
```

## tapable 中的 hook 类都做了什么？(以 SyncHook 为例)

每个 hook 都继承自一个基类：class Hook{}. 其他类必须实现基类的抽象方法 compile。hook 基类中初始化时把["error"]传入作为 this.\_args =args;

```js
// Hook
/*

*/
class Hook {
  constructor(args) {
    if (!Array.isArray(args)) args = [];
    this._args = args;
    this.taps = [];
    this.interceptors = [];
    this.call = this._call;
    this.promise = this._promise;
    this.callAsync = this._callAsync;
    this._x = undefined;
  }
  compile() {
    throw new Error("Abstract: should be overriden");
  }

  // _createCall会执行，先忽略。执行最终结果是为实例添加一个call方法。
  // 这里调用的就是compile方法，compile需要返回一个call方法，webpack invoke特定hook就是
  // this.hooks.failed.call(),最终执行的就是this['call']()
  // this[name:call] = this._createCall(type);
  // return this[name](...args);
  _createCall() {
    return this.compile({
      taps: this.taps,
      interceptors: this.interceptors,
      args: this._args,
      type: type,
    });
  }
  tap() {}
  tapAsync() {}
  tapPromise() {}
  _runRegisterInterceptors() {}
  _insert() {}
}
```

发现该类的实例方法有 compile、tap、\_createCall、\_insert。到这里后就回想写 webpack plugin 时的结构。

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.failed.tap(pluginName, () => {});
  }
}
```

执行`compiler.hooks.failed.tap`时，为 this.taps 中 push 进传入的回调函数。

再看 SyncHook 实现的 compile 方法实现

```js
compile(options) {
    // {
    //     type: 'sync',
    //     args: 'error', 这里的args会作为function的形参
    //     taps: [fn]
    // }
    factory.setup(this, options);
    return factory.create(options);
}
```

这里的 factory 是通过`const factory = new SyncHookCodeFactory();`实例化;`SyncHookCodeFactory`是继承`HookCodeFactory`来的。（非 SyncHook 也是继承自该基类）
再看`HookCodeFactory`

```js
// 这里先不看其他函数，只看用到的setup和create。setup是保存了下tap进来的回调函数
// create的返回值是fn。看生成逻辑后，发现最终fn是以下结构:
function fn() {
  "use strict";
  var _fn0 = _x[0];
  _fn0();
}
// 如果是AsyncHook，初始化fn时，会为fn拼形参（如回调函数）,实现了异步hook时，传入第二个回调参数的效果。例如：
function fn(params, _callback) {
  "use strict";
  var _fn0 = _x[0];
  _fn0();

  _callback();
}
// 也就是说HookCodeFactory类目的就是把tap传进的函数包裹一下创建一个call执行时可以调用的函数
// 所以实现了plugin的传进来的函数在call执行时执行
class HookCodeFactory {
  constructor(config) {
    this.config = config;
    this.options = undefined;
    this._args = undefined;
  }

  create() {
    this.init(options);
    let fn;
    switch (this.options.type) {
      // 省略部分代码
      case "sync":
      case "async":
      case "promise":
    }

    return fn;
  }
  setup() {
    instance._x = options.taps.map((t) => t.fn);
  }
  init(options) {
    this.options = options;
    this._args = options.args.slice();
  }

  deinit() {
    this.options = undefined;
    this._args = undefined;
  }
  callTap() {}
  callTapsSeries() {}
  args() {}
  getTapFn() {}
}
```

## 总结

webpack 的 hook 通过`new SyncHook()`实例化，会返回一个拥有 call 方法的对象。在 webpack 执行到特定阶段时，调用 call 方法。`HookCodeFactory`就是为了生成 call 方法，并挂在到 hook 实例 this 上。
类调用关系:SyncHook 继承 Hook,SyncHookCodeFactory 继承自 HookCodeFactory,SyncHook 调用 HookCodeFactory 实例方法挂载 call 方法。
