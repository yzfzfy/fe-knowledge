# redux-saga 源码逻辑梳理

源码来自 2022-06-21 克隆的 master 代码。
具体使用 saga 的代码参考源码文件夹内 examples\counter\src\sagas\index.js 路径下的 rootSaga。一个简单的异步逻辑。

saga： 英文解释有'一系列任务'的含义。有助于理解 redux-saga 所做的事。

从大致使用上用了 generator 函数，所以猜测 redux-saga 库是通过接收 store.dispatch 来控制 generator 函数生成遍历器的流程。

## middleware.js

导出 createSaga 工厂方法=>sagaMiddlewareFactory,使用直接`createSagaMiddleware()`，返回值就可以作为 redux applyMiddleware 的参数，结果如下

```js
function sagaMiddleware({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, {
        ...options,
        context,
        channel,
        dispatch,
        getState,
        sagaMonitor,
    });

    return (next) => (action) => {
        if (sagaMonitor && sagaMonitor.actionDispatched) {
            sagaMonitor.actionDispatched(action);
        }
        const result = next(action); // hit reducers
        channel.put(action);
        return result;
    };
}
```

这里在创建 saga 时，做了一个绑定

```js
boundRunSaga = runSaga.bind(null, {
    ...options,
    context,
    channel,
    dispatch,
    getState,
    sagaMonitor,
});
```

是因为 redux-saga 内部需要获取 store 的状态和 dispatch 方法，所以在 apply 中间件时需要做一次绑定。
saga 中间件的主要逻辑是直接执行`next(action)`,这是让后续其他中间件或者 store.dispatch 直接执行，saga 的异步流程不影响正常的 dispatch。然后除了正常流程多了一个`channel.put(action)`，这就是 saga 的主要作用点。

初始化 store 时，需要手动执行一下`saga.run`,这里就是执行 bind 过后的 runSaga。执行参数是一个我们在 saga 文件定义的 generator 函数。

==> 因为 generator 函数需要手动的执行返回遍历器函数的 next 方法，所以这里暂时猜测传入的 generator 函数在 run 时会被执行并在必要时会执行 next 方法。

## runSaga

然后再看 store 初始化时，执行的 run 方法做了什么，runSaga 文件。

### 返回遍历器

进入后直接执行了 saga，可见 run 时的第二个参数就是传给 generator 函数的值（一般不用这个参数）

```js
const iterator = saga(...args);
```

### 生成 effectId

nextSagaId 就是返回一个自增数的 id 数字，后续逻辑好像就是为了记住任务 id，遇到下一个任务时还会自增返回。

```js
const effectId = nextSagaId();
```

### 生成 finalizeRunEffect

根据名称猜测这是一个函数，用于最终任务执行完后需要执行的函数，这里的判断 if (effectMiddlewares) 在常规使用时没有传入，所以为 undefined，所以走 else 分支，

```js
let finalizeRunEffect;

if (effectMiddlewares) {
    const middleware = compose(...effectMiddlewares);
    finalizeRunEffect = (runEffect) => {
        return (effect, effectId, currCb) => {
            const plainRunEffect = (eff) => runEffect(eff, effectId, currCb);
            return middleware(plainRunEffect)(effect);
        };
    };
} else {
    finalizeRunEffect = identity;
}
```

identity 是一个返回传入值的函数`export const identity = v => v`

### env 常量的初始化

```js
const env = {
    channel,
    dispatch: wrapSagaDispatch(dispatch),
    getState,
    sagaMonitor,
    onError,
    finalizeRunEffect,
};
```

-   channel 常规使用没传默认为 stdChannel()的结果，后续看这部分。
-   dispatch 使用 wrapSagaDispatch 包裹了 store.dispatch，看逻辑是在 dispatch 传入的 action 上 define 一个属性 `@@redux-saga/SAGA_ACTION`值为 true。可见这里传入的 action 是一个对象，这里为 true 猜测后面会判断，只有经过包装过的 dispatch 才会作用。
-   getState 就是 store 原来的 getState
-   sagaMonitor 常规使用不传，所以后续判断这个的都是否
-   onError 常规使用不传，默认是一个 console.error(error)
-   finalizeRunEffect 如上 `v => v`

### immediately 函数执行 返回值作为 runSaga 的返回值

常规使用返回值没有被用到

看定义就是 immediately 就是接收一个函数直接执行的。就先理解为就是执行函数。

函数体

```js
const task = proc(env, iterator, context, effectId, getMetaInfo(saga), /* isRoot */ true, undefined);
```

传入 env ，iterator effectId context={}

getMetaInfo 返回一个对象 name 属性是 saga 函数名

isRoot true 后续逻辑猜测表明这是任务的开始点
undefined cont 后续看。

## proc 函数

逻辑是返回一个 task，返回值在根的 generator 函数时不会使用，一般不会用到，一般目的就是在有子任务时才会返回子任务供执行。

通观全部逻辑，执行过的函数只有 next(), 那就是逻辑的起点了。

next 没有传入参数，分析判断后是走入的 else 分支，`result = iterator.next(arg)`，可见是执行了我们传入的 generator 函数返回的遍历器的第一次 next 方法。

使用的 saga

```js
export default function* rootSaga() {
    yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}
```

有一个 yield，那第一次执行 next 时，返回值中的 value 需要看`takeEvery`的返回值(返回值看 takeEvery 分析)，done 属性值为 false。

继续往下走逻辑。走到了 if 分支，执行`digestEffect(result.value, parentEffectId, next)`方法。parentEffectId 为第一次生成自增 id，next 还是当前 next 函数（猜测是还要继续执行 next）。

### digestEffect

该方法最后执行了 finalRunEffect，传入了刚才的 result.value、新生成的 effectId(说明开始了下一个任务)、currCb（将 next 包装过的回调方法）

分析 finalRunEffect 的定义逻辑后，就认为是 runEffect 方法

runEffect 的逻辑是一堆判断

```js
if (is.promise(effect)) {
    resolvePromise(effect, currCb);
} else if (is.iterator(effect)) {
    // resolve iterator
    proc(env, effect, task.context, effectId, meta, /* isRoot */ false, currCb);
} else if (effect && effect[IO]) {
    const effectRunner = effectRunnerMap[effect.type];
    effectRunner(env, effect.payload, currCb, executingContext);
} else {
    // anything else returned as is
    currCb(effect);
}
```

所以这里判断了刚才的 takeEvery 的的返回值类型。大致看过 takeEvery 后知道返回值是一个拥有`@@redux-saga/IO`属性的对象（{type: 'FORK', payload: {}, `@@redux-saga/IO`: }），所以走入`else if (effect && effect[IO])`分支。

执行了
`runForkEffect(env, { context, fn, args, detached }, cb, { task: parent })`

其中又是执行了 proc 函数，返回

```js
immediately(() => {
    const child = proc(env, taskIterator, parent.context, currentEffectId, meta, detached, undefined);

    if (detached) {
        cb(child);
    }
});
```

这里的 cb 就是 上方包装过的遍历器的 next 函数，再次执行。

## 以 takeEvery 为例 解析

业务逻辑中使用的 takeEvery 来自于 packages\core\src\internal\io-helpers.js 路径下的 takeEvery，他的返回值使用了 fork 函数，传入了 sageHelpers 中的 takeEvery，还有传入的第一个类型字符串和，字符串类型对应的 generator 函数。

```js
export function takeEvery(patternOrChannel, worker, ...args) {
    if (process.env.NODE_ENV !== 'production') {
        validateTakeEffect(takeEvery, patternOrChannel, worker);
    }

    // 这里的patternOrChannel是'INCREMENT_ASYNC' worker是function* incrementAsync() {}
    return fork(takeEveryHelper, patternOrChannel, worker, ...args);
}
```

而 fork 函数是用于生成 effect 的函数，产出的结果都是以下形式:

```js
{
    IO: true,
    type: 'fork',
    payload: {
        fn: '传入的函数,这里是takeEveryHelper',
        args: ['INCREMENT_ASYNC', function* incrementAsync() {}]
    }
}
```

这就是以上在初始 runSaga 且走到 proc 逻辑，执行 next 时，rootSaga 遍历器返回的 result.value。

然后就又到了 if (effect && effect[IO])这个判断，依然从 effectRunnerMap[effect.type]中找到对应类型的 runner 执行，这里时 fork，

runForkEffect 的逻辑就是取出 takeEveryHelper，如果这个执行后返回一个遍历器，那就将此遍历器再次传到 proc 函数执行，下面是 takeEveryHelper 逻辑

```js
export default function takeEvery(patternOrChannel, worker, ...args) {
    const yTake = { done: false, value: take(patternOrChannel) };
    const yFork = (ac) => ({ done: false, value: fork(worker, ...args, ac) });

    let action,
        setAction = (ac) => (action = ac);

    return fsmIterator(
        {
            q1() {
                return { nextState: 'q2', effect: yTake, stateUpdater: setAction };
            },
            q2() {
                return { nextState: 'q1', effect: yFork(action) };
            },
        },
        'q1',
        `takeEvery(${safeName(patternOrChannel)}, ${worker.name})`,
    );
}
```

先简单的查找 fsmIterator 方法，确认是返回了一个 iterator，所以将此 iterator 传入 proc 执行，执行了此 iterator 的 next 方法。接下来看此 iterator 的逻辑是什么？

上处 takeEvery，显示初始化了两个对象，一个用到了 take，一个用到了 fork。
然后先看下 fsmIterator 的定义

```js
function fsmIterator(fsm, startState, name) {
    let stateUpdater,
        errorState,
        effect,
        nextState = startState;

    function next(arg, error) {
        if (nextState === qEnd) {
            return done(arg);
        }
        if (error && !errorState) {
            nextState = qEnd;
            throw error;
        } else {
            stateUpdater && stateUpdater(arg);
            const currentState = error ? fsm[errorState](error) : fsm[nextState]();
            ({ nextState, effect, stateUpdater, errorState } = currentState);
            return nextState === qEnd ? done(arg) : effect;
        }
    }

    return makeIterator(next, (error) => next(null, error), name);
}
```

这里先看形参的命名，第一个是 fsm，先不看，第二个是 startState，初始状态，可知第二个参数是表示了生成的 iterator 的初始从哪执行，再看第一个 fsm 的传参，是一个 map，并且他的第一个 key 是和第二个参数是对应的，可以猜到这里的 startState，应该是让 iterator 先找哪个 key 下的 value 作为遍历器执行的值，因为 startState 是 q1，这里看 q1 的 value，

```js
{ nextState: 'q2', effect: yTake, stateUpdater: setAction }
```

q1 的下一个状态是 q2,effect 是 ytake，就猜到这里是当遍历器执行时先取 q1 下的返回值，取出他的 nextState 作为下次要执行的 key，因为 ytake 的值是一个{io:true, type: 'take',{pattern: 'INCREMENT_ASYNC'}}这种形式，所以 effect 是一个 io 判断为 true 的值。

然后再回到 proc 中 next 执行那的逻辑，runEffect 的 io 判断为正值后，又走到了 runTakeEffect，

```js
function runTakeEffect({ pattern }, cb) {
    const takeCb = (input) => {
        cb(input);
    };

    channel.take(takeCb, is.notUndef(pattern) ? matcher(pattern) : null);
}
```

这里是初始化了一个 takeCb 函数，cb 可以追溯到 next 方法中，是将 next 方法又传入作为回调函数，所以这里的 cb 就是 next。然后执行了 channel.take，第一个参数是接收输入执行 next，第二个参数最终也是一个函数`(input) => input.type === String(pattern)`,该函数返回一个布尔值，函数体中可以猜测 input 应该是一个 redux 的 action，拥有 type 属性。

然看 channel.take 方法做了什么？

首先 channel 是在 runSaga 时，如果不传默认值是通过 stdChannel()生成的。生成的值为一个对象

```js
{
    [MULTICAST]: true,
    put(){},
    take(cb.matcher){
        cb[MATCH] = matcher
        nextTakers.push(cb)
    }
}
```

channel 在返回值时，闭包创建了一个 nextTakers 的数组，执行 take 方法时，将传入的 cb push 进入这个数组。所以 channel 是通过闭包可以引用到这个 takers 数组。

至此，在 redux store 初始化并 runSaga 方法执行后的逻辑全部走完。最后效果是在生成的 channel 中 takers 数组中 push 进入了一个回调函数，这个回调函数是接受一个 input，将 input 传入执行 next 的过程。

那么这个回调函数在什么时机执行呢？
redux 的状态改变是通过 dispatch，redux-saga 中间件接受到 action，执行 dispatch 就是这个回调执行的时机。

再回头看 sagaMiddleware 初始化时，除了执行 next(action)，还执行了`channel.put(action)`,再看 put 方法的函数体。

```js
put(input) {
    const takers = (currentTakers = nextTakers)

    for (let i = 0, len = takers.length; i < len; i++) {
        const taker = takers[i]

        if (taker[MATCH](input)) {
            taker.cancel()
            taker(input)
        }
    }
}
```

发现遍历了 nextTaker 数组并执行。这里的 if 判断，在上方 take 时已经传入了一个判断函数，在当 put 的字符串和初始化的 takeEvery 的值相同时为真值，所以只有 put 正确的字符串才会执行。然后执行 taker(input)，这里的 input 就是 action 字符串，然后回溯执行 next，此时的 next 执行又到了 fsmIterator 的 next 方法，要从 fsm 中找见 nextState 对应的 effect，现在 nextState 是 q2，解析出 effect 是`{ done: false, value: fork(function* INCREMENT_ASYNC(){}, ...args, ac)`，又出现了 fork，之前的 fork 是被 runForkEffect 执行后产生了子任务，一直 next 下去，(具体是：遇到 promise 就将回调在 then 执行，遇到遍历器就继续执行遍历器的 next 等等)，知道最终 generator 函数执行完。（一般 generator 函数最后都会有 dispatch 的执行，put 方法接收一个 action，在它的逻辑内执行上就是执行了 dispatch(action)）

### take 方法

yTake 初始化为`{ done: false, value: take(patternOrChannel) }`，可看到这是一个 iterator 执行 next 后返回值的类型，value 为`take(patternOrChannel)`，这里的 patternOrChannel 是我们出传入的字符串值`INCREMENT_ASYNC`，再找 take 方法，根据判断分支走到了返回值为：

```js
return makeEffect(effectTypes.TAKE, { pattern: patternOrChannel });
```

`effectTypes.TAKE`为一个定义的字符串 TAKE 的值就是'TAKE'，第二个参数是`{pattern: INCREMENT_ASYNC}`。

看 makeEffect:

```js
const makeEffect = (type, payload) => ({
    [IO]: true,
    // this property makes all/race distinguishable in generic manner from other effects
    // currently it's not used at runtime at all but it's here to satisfy type systems
    combinator: false,
    type,
    payload,
});
```

这里传入的 type 就是 TAKE，payload 是`{pattern: INCREMENT_ASYNC}`，形式上像是构造了一个 redux 的 action，并且加了[IO]属性，这也是个值为'IO'的常量。用于后边判断，只要经过 makeEffect 生成的都是 true。io.js 文件内的所有导出的函数都是出于 makeEffect。这些函数叫做 io，而 takeEvery、takeLatest、takeLeading、这些叫 sagaHelper。

## 总结

redux-saga 是一个中间件，他是基于 generator 函数和遍历器概念的。遍历器的执行依赖 next 方法的执行，redux-sage 将 redux 的 dispatch 动作附加了执行 next 方法的作用。

必须先生成遍历器才可执行，所以 redux-saga 中间件应用后，必须首先要运行 runSaga 来生成遍历器，将此遍历器放入一个 channel 内，这个 channel 可以无限调用遍历器的 next 方法，直至 done 为 true。

在页面发起 dispatch 动作后，会调用 channel 提供的方法，来启动执行 next 方法，next 方法会递归传入回调函数，上一个 yield 完成后就自动执行下一个 next。

最终效果是页面发起 dispatch=>提供的 generator 执行=>最终执行真实的 store.dispatch，修改 store 数据=>页面数据刷新

redux-saga 就像是定义了一系列的任务，任务的启动执行，交由 dispatch 开始，相比于 redux-thunk 的依赖回调执行异步任务，它像是将任务集中抽离出来，类似 await 一样的同步执行。

当需要类似的需要控制任务执行的需求时，可以参考 redux-saga 的模式，通过定义 generator 函数来定义一系列任务，中间通过 take 来暂时暂停往下 next，同时监听一个类型，监听到时可以继续往下 next。这样知道任务执行结束。通过 takeEvery、takeLatest、takeLeading 来实现类似的有单独线程来执行任务。
