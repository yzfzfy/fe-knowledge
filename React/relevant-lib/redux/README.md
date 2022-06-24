# Redux

redux 是一个可预测的状态容器，他是基于 Flux 模式的状态库。它并不是和 react 绑定的，而是可以和任何视图框架结合使用。

## Redux 特点

-   单一数据源 整个应用的状态数据被存储在一个对象树中，该对象树的状态变化易于追踪和查询
-   状态只读 改变状态数据只有一种方式，就是派发一个 action，action 是一个普通对象
-   改变状态逻辑依赖 reducer，是一个纯函数，reducer 接收旧的状态和 action 作为参数，产出新的状态。

## api

### createStore

`createStore(reducer, preloadedState?,enhancer?)`

大致逻辑分析：
createStore 函数返回一个对象，这个对象包含了三个主要的常用的 key

-   getState 返回当前状态数据的 state，state 是对 createStore 执行时初始化的 state 对象的闭包引用，整个生命周期内都是同一个 state 对象，包括发起 dispatch 时必须返回新的 state 以覆盖此 state 引用。
-   dispatch 用于触发状态改变，接收参数是一个 plainObject 规定了其中必须有 type 字段，一个 type 类型对应状态如何变化的 reducer 的一个 if 分支。
-   subscribe 当 store 的 state 改变时，需要通知监听的函数。参数接收一个监听函数，state 改变时，触发执行此函数，此函数返回一个取消监听的函数`unsubscribe`，取消监听的函数也是通过闭包实现的。

```ts
// 关键逻辑 去除了一些判断
function createStore(reducer, preloadedState, enhancer) {
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error(`Expected the enhancer to be a function. Instead, received: '${kindOf(enhancer)}'`);
        }

        return enhancer(createStore)(reducer, preloadedState as PreloadedState<S>) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;
    }

    let currentReducer = reducer;
    let currentState = preloadedState as S;
    let currentListeners: (() => void)[] | null = [];
    let nextListeners = currentListeners;
    let isDispatching = false;

    function dispatch(action: A) {
        // 判断

        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        const listeners = (currentListeners = nextListeners);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }

        return action;
    }

    function subscribe(listener: () => void) {
        // 判断

        let isSubscribed = true;

        nextListeners.push(listener);

        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }

            isSubscribed = false;

            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
            currentListeners = null;
        };
    }

    function getState(): S {
        // 省略判断

        return currentState;
    }

    function replaceReducer(nextReducer) {
        // 省略判断

        // TODO: do this more elegantly
        (currentReducer as unknown as Reducer<NewState, NewActions>) = nextReducer;

        // This action has a similar effect to ActionTypes.INIT.
        // Any reducers that existed in both the new and old rootReducer
        // will receive the previous state. This effectively populates
        // the new state tree with any relevant data from the old one.
        dispatch({ type: ActionTypes.REPLACE });
        // change the type of the store by casting it to the new store
        return store;
    }

    const store = {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable,
    };

    return store;
}
```

### combineReducers

combineReducers 只是一个辅助函数。

```json
{
    "key1": "state",
    "key2": "state"
}
```

对于如上的 state 结构，状态的粒度定义是某一个 key 下状态，而不是作为一个整体的 state 对象，相当于多了一级。如果应用变得复杂，需要对 reducer 函数 进行拆分，拆分后的每一块独立负责管理 state 的一部分时，就需要该函数了。
该函数接收一个分类的 reducer，普通的 reducer 是一个函数类型，dispatch 一个 action，就会执行该函数，传入的是一整个 state；返回新 state。这个 combination 的 reducer 是一个对象类型，形如

```js
{
    key1: reducer function,
    key2: reducer function
}
```

这里的 key 是和 state 中的 key 一一对应的。

执行函数后返回一个 dispatch 时会调用每个 key 对应的 reducer function，传入的是同一个 action。

_但是如果两个 key 下的 reducer 函数对于同一个 action type 都有处理，那么会都调用一遍_

```ts
// 取消了一些判断，保存主要的逻辑
export default function combineReducers(reducers: ReducersMapObject) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers: ReducersMapObject = {};
    for (let i = 0; i < reducerKeys.length; i++) {
        const key = reducerKeys[i];

        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key];
        }
    }
    const finalReducerKeys = Object.keys(finalReducers);

    return function combination(state, action) {
        let hasChanged = false;
        const nextState = {};
        for (let i = 0; i < finalReducerKeys.length; i++) {
            const key = finalReducerKeys[i];
            const reducer = finalReducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
        return hasChanged ? nextState : state;
    };
}
```

### bindActionCreators

这也是一个辅助函数，action 通常是一个含有 type 属性的普通对象，type 对应着 reducer 中需要的操作，但是仅有操作还不够，还需要传递操作的参数，所以往往 action 中含有其他数据，因此一般会有一个函数通过传递数据参数来生成 action，这个函数就叫 actionCreator。进一步，一般派发一个 action 都需要 store.dispatch(action)，所以这里的 dispatch 也是可以封装进来，封装的结果就是最终调用时是`resAfterBind.someKey()`，更语义化。

封装结果是返回一个函数，这个函数调用时，因为已经绑定了 dispatch 和 actionCreator，所以只需要传递 action 需要的数据作为参数即可。封装用到的还是**闭包高阶函数**

```js

function bindActionCreator(
  actionCreator,
  dispatch
) {
  return function (this, ...args) {
    return dispatch(actionCreator.apply(this, args))
  }
}

function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators,dispatch)
    }

    const boundActionCreators = {}
    for (const key in actionCreators) {
        const actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        }
    }
    return boundActionCreators
}


```

### compose

compose 函数的代码很少，但是他的意义很重要。在 compose 的基础上可以引出函数式编程中的洋葱模型（先进后出）。

简单理解就是组合了给定几个函数的调用，上一个函数调用的结果作为下一个调用函数的参数。

compose 返回的是一个函数，当传入参数的顺序是`[a,b,c]`时，最终这个函数执行时的形式是`a(b(c(args)))`，相当于传入的函数是逆序执行。

```js
export default function compose(...funcs: Function[]) {
    if (funcs.length === 0) {
        return (arg) => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce(
        (a, b) =>
            (...args: any) =>
                a(b(...args)),
    );
}
```

```js
// 洋葱模型
// 定义三个函数
function foo1(next) {
    console.log('foo1 init');
    return function (...args) {
        console.log('foo1-in-start');
        next(args);
        console.log('foo1-in-end');
    };
}

function foo2(next) {
    console.log('foo2 init');
    return function (...args) {
        console.log('foo2-in-start');
        next(args);
        console.log('foo2-in-end');
    };
}

function foo3(next) {
    console.log('foo3 init');
    return function (...args) {
        console.log('foo3-in-start');
        next(args);
        console.log('foo3-in-end');
    };
}

// 然后将三个函数使用compose组合
const fn = compose(foo1, foo2, foo3);

// 执行返回函数 传入一个next函数 返回一个函数
const fb = fn(() => {
    console.log('lalala');
});

// 执行此函数观察返回结果  符合先进后出
// foo3 init
// foo2 init
// foo1 init
// foo1-in-start
// foo2-in-start
// foo3-in-start
// lalala
// foo3-in-end
// foo2-in-end
// foo1-in-end
```

### applyMiddleware

为 redux 添加中间件的方法。redux 的特征如可预测性、可回溯状态都依赖于该方法实现。

封装逻辑：
上述的可预测性、可回溯状态可见都是状态的变化过程是透明的，所以要观察变化行为，重点还是监听（或者说包装）他的 dispatch 方法。引出 applyMiddleware 的逻辑就是将 redux 的 dispatch 方法做了一层包装，将中间件实现的功能在 dispatch 时同步调用。

首先 applyMiddleware 调用的结果的用法是传入 createStore 的第三个参数（enhancer）,createStore 处理逻辑的 enhancer 使用是 enhancer(createStore)(reducer,preloadedState)，基于此用法，所以 applyMiddleware 的调用结果是返回一个函数，这个函数接收一个参数(createStore)，返回的函数调用结果还是一个函数，这个函数接收两个参数（reducer,preloadedState）。如下：

```js
function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, preloadedState) {};
    };
}
```

接下来是处理逻辑，上述说到了就是封装 dispatch 函数，所以要从传参的`createStore`,`reducer`,'preloadedState'中提取出 store.dispatch 再封装。

```ts
function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, preloadedState) {
            // 取出dispatch方法
            const store = createStore(reducer, preloadedState);
            let dispatch: Dispatch = () => {
                throw new Error(
                    'Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.',
                );
            };

            const middlewareAPI: MiddlewareAPI = {
                getState: store.getState,
                dispatch: (action, ...args) => dispatch(action, ...args),
            };
            // 这里把redux状态和dispatch方法传如所有所有的中间件，使中间件可以获取到。
            // 通过这里可以看到moddleware应该是一个接收一个参数(对象，且有getState方法和dispatch方法的)返回一个函数的函数。
            const chain = middlewares.map((middleware) => middleware(middlewareAPI));
            // 这里使用到了上述的compose函数，返回一个最终的dispatch方法
            // 组件中最终调用此dispatch方法时，会逆序调用中间件
            // 这里传入了dispatch函数，继续推断就是中间件返回的函数又接收一个dispatch函数
            // 接收dispatch函数后，又返回一个新的函数，这个函数接收一个action参数。这正是上述的洋葱模型的应用
            dispatch = compose<typeof dispatch>(...chain)(store.dispatch);

            return {
                ...store,
                dispatch,
            };
        };
    };
}
```

### isPlainObject

redux 中有一个工具方法可以借鉴使用，考察原型链知识点。

```js
export default function isPlainObject(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
}
```

### 总结

api 的主要部分是 createStore，使用它的返回值就可以使用 redux 完成状态管理， 其他都是辅助函数。其中 applyMiddleware 使用了 compose 方法实现中间件定义。

## redux-thunk

这是 redux 的中间件，代码很简单就是上述中间件的定义使用

“thunk”这个词是一个编程术语，意思是 "一段做延迟工作的代码".

```ts
function createThunkMiddleware() {
    return function ({getState, dispatch}) {
        return function (next) {
            return function (action) {
                if (typeof action === function) {
                    return action(dispatch,getState,...)
                }

                return next(action)
            }
        }
    }
}

export default createThunkMiddleware()
```

可以看到 redux-thunk 就是接收的 action 是一个函数时，将 dispatch 传给该函数，由函数决定何时调用执行

## react-redux

> Official React bindings for Redux

前面分析了 redux 并不依赖其他任何库，所以它是一个纯粹的 redux 库。要想在 react 中使用，即：和 react 组件的状态结合使用，还需要一个中间的库。这就是 react-redux 的作用。

先大致梳理下上述的“结合使用”，需要什么内容。首先 redux 只是一个状态的容器和提供了有关的一些方法。react 的关于状态的哲学是状态改变，视图重新生成，页面内容更新。结合的第一步就需要让 react 组件可以获取来自 redux 状态数据，并且当页面上事件触发时可以让 redux 状态数据改变。

1. 获取数据。react 组件获取外部数据的方法有两种，一个是 props，另一个是 context。要想在每级组件都和 redux 的状态绑定一次，未免太麻烦。那就只有 context 了，从 context 的 api 上得知，要想每个组件都可以接受到来自 redux 的数据就需要将这些组件作为存储有 redux 数据的 context 的子孙组件，然后在子组件中通过 consumer 或者 contextType 或者 useContext 就可以获取数据了。
2. 改动数据。redux 的改动数据的唯一途径就是 dispatch。想要组件修改数据，自然要将 dispatch 方法注入到组件中，供组件调用。

### API

基于 7.x 版本

### Provider

使用

```jsx
import { Provider } from 'react-redux'

const store = createStore()
<Provider store={store}>
    {children}
</Provider>
```

为了让子组件都接收到 redux 状态数据，react-redux 提供了 Provider, 相当于一个包裹 react 组件,接受的 props 是 store 和 children(还有 context，不常用)，store 就是 redux 创建的 store（包括 createStore、subscriber、dispatch 等方法），children 就是子组件，直接 render 即可。

分析 Provider 逻辑，有 Provider 那就可以考虑这是 react 的 createStore 生成的，源码中可验证正确。那么 Provider 封装的 context 向下传递的 value 是什么呢？源码中可看到是

```js
{
    // 这就是props中store，
    // 从这里可以想到，如果在组件中消费context，那么同样可以取到这个store，不过没必要。
    store: store,
    //createSubscription方法使用传入的store初始化了一些函数用于状态监听等。，
    subscription: createSubscription(store)
}
```

### connect

有了 Provider，那么就到了组件从共享的 context 上获取数据了。这里 react-redux 是使用 HOC 处理的。connect 是一个高阶组件，使用如

```js
// 这里的两个参数都是函数类型
export default NewComponent = connect(mapStateToProps, mapDispatchToProps, mergeProps, {})(Component);
```

从源码中看到。connnect 做了很多判断和包裹，但是核心逻辑还是使用初始化的 store 与组件状态刷新连起来。

```jsx
function createConnect() {
    return function connect(mapStateToProps, mapDispatchToProps) {
        return connectHOC(function () {
            // 真实的逻辑不是这样简单，只是总结
            return function wrapWithConnect(WrappedComponent) {
                // 这里的context示意是react-redux创建的ReactReduxContext
                // 之前的分析已经知道contextValue是{store,subscription}
                const contextValue = useContext(context);

                const propsState = mapStateToProps(contextValue.store.getState());
                const propsDispatch = mapStateToProps(store.dispatch);
                // mapStateToProps的逻辑是这样的,redux中辅助函数bindActionCreators就用到了
                // mapStateToProps= (dispatch) => {
                //     return bindActionCreators({a: aActionCreator},dispatch)
                // }

                return <WrappedComponent {...propsState} {...propsDispatch} />;
            };
        })(SourceComponent);
    };
}
```

总结：
最终使用方式：

```jsx
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function Index({ props }) {
    return (
        <div
            onClick={() => {
                props.bbb('data');
            }}
        >
            {props.aaa}
        </div>
    );
}

export default connect(
    function mapStateToProps(state) {
        return {
            aaa: state.aaaFromReduxStore,
        };
    },
    function mapDispatchToProps(dispatch) {
        return bindActionCreators(
            {
                bbb: function bbbActionCreator(params) {
                    return {
                        type: 'typebbb',
                        data: params,
                    };
                },
            },
            dispatch,
        );
    },
)(Index);
```

### hooks

函数式组件使用 redux 时，

-   useStore

比较简单，

```ts
function useStore() {
    const { store } = useReduxContext();
    return store;
}
```

-   useSelector

传入一个函数。此函数值会被传入 store 中的状态数据，可以返回想要的某个数据。

什么是 selector？

选择器。 Selector 这个概念并不是 Javascript 或者 React、Redux 的一个概念。想象一下你去便利店买可乐，你给店员说要可口可可，这时候店员就去给你拿一罐可口可乐，这时候，店员其实就是充当了 Selector 的角色，店员知道如何从各种商品里拿到你要的可口可乐，具体来说 Selctor 有以下特点：

所以说`function (state) { return state[key] }`，就是一个最简单的 selector 函数。

```ts
function useSelectorWithStoreAndSubscription(selector, store) {
    let storeState = store.getState();
    let selectorState = selector(storeState);

    // 省略一些判断
    // ...

    // 这个自定义hook中有一个可以学习
    // useReducer传入reducer和initialState,返回state和dispatch方法
    // 使用每次每次返回的state+1  会引起页面刷新，可作为forceUpdate使用
    const [, forceRender] = useReducer((s) => s + 1, 0);
    // 强制刷新
    forceRender();

    return selectorState;
}
function useSelector(selector) {
    const { store, subscription } = useReduxContext();

    const selectedState = useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub);

    return selectedState;
}
// 使用
const aaaValue = useSelector((state) => state.aaa);
```

-   useDispatch

比较简单，只是对于 store.dispatch 的封装

```ts
function useDispatch() {
    const store = useStore();
    return store.dispatch;
}
```

-   useReduxContext

也可以使用导出的 context

```ts
function useReduxContext() {
    const contextValue = useContext(ReactReduxContext);

    return contextValue;
}
```

## reselect

reselect 库导出的最主要的 api 就是`creatSelector`。做性能优化使用。

```ts
// 使用方法

import { creatSelector } from 'reselect';

const increase = (state) => state.count + 1;
const decrease = (state) => state.count - 1;

const selectorIns = creatSelector(increase, decrease, (sss) => sss);
```

createSelector 函数接受不定参数，一般传递的都是函数参数，最后一个函数依赖之前的函数。具体依赖方式是前几个函数的返回值会分别传给最后一个函数。生成的 selectorIns 是一个新函数，这个新函数接受的参数，都会传给依赖的函数，用于计算得出最后一个函数的实参，然后求出 selectorIns 的结果。

他之所以可以做性能优化是因为只要有一个依赖函数的返回值变化，那就会重新执行最后一个函数求值，否则返回缓存的上一次的值。

```ts
// 源码逻辑大致如下，只列出重要部分

import { defaultMemoize } from './defaultMemoize';

function createSelectorCreator(memoize) {
    return function createSelector(...funcs) {
        // 取出最后一个函数，剩下的是依赖
        const resultFunc = funcs.pop();

        const memoizedResultFunc = memoize(function recomputationWrapper() {
            recomputations++;
            // apply arguments instead of spreading for performance.
            // 最后会把依赖的值，挨个传给最后一个函数执行
            return resultFunc!.apply(null, arguments);
        });

        // 重要是的将依赖函数的执行做了缓存处理
        const selector = memoize(function dependenciesChecker() {
            const params = [];
            const length = dependencies.length;

            for (let i = 0; i < length; i++) {
                // 将最终生成的selector函数的参数传给依赖的函数逐个执行，结果在传给最后一个函数执行
                // @ts-ignore
                params.push(dependencies[i].apply(null, arguments));
            }

            // apply arguments instead of spreading for performance.
            lastResult = memoizedResultFunc.apply(null, params);
            // 最终返回执行结果
            return lastResult;
        } as F);
    };
}

export const createSelector = createSelectorCreator(defaultMemoize);

// 再来看关键的defaultMemoize函数

export function defaultMemoize() {
    return function memoized() {
        // 传入的参数缓存，在get时，会对arguments的每项做严格相等判断，只要有一项不同就需要重新求值。
        let value = cache.get(arguments);
        if (value === NOT_FOUND) {
            // 这里就是重新求值
            // @ts-ignore
            value = func.apply(null, arguments);

            if (resultEqualityCheck) {
                const entries = cache.getEntries();
                const matchingEntry = entries.find((entry) => resultEqualityCheck(entry.value, value));

                if (matchingEntry) {
                    value = matchingEntry.value;
                }
            }

            cache.put(arguments, value);
        }
        return value;
    };
}
```

createSelector 在 react 组件的使用就是和 redux、react-redux 配置使用，在 mapStateToProps 时，缓存根据 redux store 的 state 计算传入组件的 props 的求值过程。当组件需要的状态在 redux store 中没有改变时，如果新状态的计算量很大，就省略了这部分过程。

```js
const getDemoData = (state, key) => {
    return state[key];
};
const demoDataSelector = createSelector(getDemoData, (data) => data);
const mapStateToProps1 = (state) => {
    return {
        demoData: demoDataSelector(state, 'demo_1'),
    };
};
```

## @reduxjs/toolkits

这是一个 redux 官方出的一个工具集，只是将 redux 的各个相关功能或库，集中封装使用，内置了 immer 工具

主要是为了解决这三点

-   "Configuring a Redux store is too complicated"
-   "I have to add a lot of packages to get Redux to do anything useful"
-   "Redux requires too much boilerplate code"

总计其实还是 redux 并不是一个专为 react 定制的状态库，他只是实现了 flux 的一种状态管理模式库，他是纯 js，并不会硬性绑定在某个 ui 库上，要绑定自然要拓展其他库，所以推出了这个工具级，简化使用。

### 主要 api

-   configureStore.ts。 传入 redux 需要的配置，生成 store
-   createAction 传入一个 type string 类型，生成一个 actionCreator 函数
-   createReducer 传入 initialState 和 actionMap(也可以是个函数，不过不常用)，生成 reducer。在传入 configureStore
-   createSlice 传入一个 name、initialState、reducers 返回一个这样的结构

```ts
{
    name : string,
    reducer : ReducerFunction,
    actions : Record<string, ActionCreator>,
    caseReducers: Record<string, CaseReducer>.
    getInitialState: () => State
}
```

可以理解成生成一个关于 store 有用的片段，生成的 actions 是一个 actionCreatorMap，reducer 的值可作为 combineReducer 的参数。

-   createAsyncThunk 和 react-thunk 结合使用，接受一个生成 action 的字符串和 payload creator 回调函数，此函数应该返回一个包含一些数据 promise 或者是出错的 promise

[定义](https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/src/createAsyncThunk.ts#L451)

使用:

```ts
const fetchPost = createAsyncThunk('posts/fetchPosts', async () => {
    const res = await api.get('url');
    return res;
});
```

解析：前面说过 thunk 函数就是用来延迟运算逻辑的函数，这里的 asyncThunk 应该就是延迟运算的逻辑是异步的意思。它其实就是也是辅助函数，如果没有它，在 redux-thunk 的基础上实现的话就是在 dispatch 中的函数参数是一个异步的操作。createAsyncThunk 只是把这个异步函数封装起来，返回常用的异步的三个状态供使用。

这个函数必须搭配 redux-thunk 使用，因为其中还并不是直接 dispatch 的一个 action，而是 dispatch 了一个函数

`createAsyncThunk` 支持传入一个表明此异步操作的类型字符串，和一个异步执行函数。这个函数也叫`payloadCreator`，因为这个函数最终会被传入 payload 参数（此参数会被传入给异步函数发起请求的，不是必填的，看具体业务）。`createAsyncThunk`会返回一个函数，这个函数支持传入发起异步执行函数的参数，这个函数又返回一个函数，这个函数最终会被 `redux-thunk` 执行（传入 dispatch,getState,extra），这个函数的逻辑是 promise 的执行，promise 的各个状态都会发起 dispatch。

## redux-logger

redux 中间件，大致逻辑

```ts
function createLogger({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            console.log('before dispatch state', 'action' + action, getState());

            const retureValue = next(action);

            console.log('after dispatch state', 'action' + action, getState());

            return retureValue;
        };
    };
}
```

此中间件的作用是为了跟踪 store 状态的变化，将每次 dispatch 前后的 store 状态都打印到控制台上。

此中间件必须作为 applyMiddleware 的最后一个参数应用，因为洋葱模型，注册中间件时，只有最后的中间件被传入的 next 函数是真正的 store.dispatch 函数，当前边的中间件有返回值时，可能还在 promise pending 中或者在 thunk 过程中，store 真正的 dispatch 过程可能还没有发生。

## redux-saga

[saga 运行逻辑分析](./redux-saga-source-process.md)

redux 的核心代码文件是 proc.js、channel.js、io.js、effectRunnerMap.js。

### 主要 API

-   sagaMiddlewareFactory 用于创建 redux 中间件，通过 applyMiddleware 应用到 redux。
-   sagaMiddleware.run 用于运行 saga，其实就是执行 generator 函数，生成遍历器，开启任务
-   channel 本质上是一个事件中心。通过 channel.take(taskFn)，push 进回调，通过 channel.put(action)来 fire 函数。
-   fork 英文有分叉意。表明开始一个新任务。一般使用`fork(gen)`，传入 generator 函数，并开始执行。
-   take take(action) 将一个任务 push 进 channel，并停止 fork 往下的任务，在页面上通过 dispatch(action) ，在中间件中最终引起执行 channel.put(action)来执行 next，触发任务继续往下执行
-   put 触发 channel 中的任务执行，channel.put(action)就是 redux-saga 中间件向 redux 中增加的功能。
-   runSomeEffect。 fork、take、put 等方法最终都是通过 makeEffect()生成对应类型的 effect 对象，这些 effect 会根据类型传入对应的 runSomeEffect 被执行。他们的不同就在于对应的 runSomeEffect 的运行逻辑不同。runForkEffect 是执行传入的 generator 函数并一直 next 下去，runTakeEffect 监听对应 action type 执行。runPutEffect 是传入一个 action，执行 store.dispatch。

### 总结

redux-saga 主要作用在于将复杂的异步任务代码转移到特定的 saga 文件中，页面中通过 dispatch 来控制对应的任务的开始暂停终止等。
