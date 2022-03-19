# react 路由方案

## 常见用法

```jsx
import { BrowserRouter } from 'react-router-dom';

<Router>
    <Switch>
        <Route>
        </Route>
    <Switch>
</Router>
```

## 常用导出内容(以下代码分析是 v5 版本的 react-router,当前最新版本为 v6)

-   Router
    在使用 react-router 路由的项目中，所有的路由页面都需要包括在 Router 中（其实严谨的还不是这个 Router 组件）。Router 其实就是一个 React 组件。代码:

```js
class Router extends React.Component {
    static computeRootMatch(pathname) {
        return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
    }

    constructor(props) {
        super(props);

        this.state = {
            location: props.history.location,
        };

        // This is a bit of a hack. We have to start listening for location
        // changes here in the constructor in case there are any <Redirect>s
        // on the initial render. If there are, they will replace/push when
        // they mount and since cDM fires in children before parents, we may
        // get a new location before the <Router> is mounted.
        this._isMounted = false;
        this._pendingLocation = null;

        if (!props.staticContext) {
            this.unlisten = props.history.listen((location) => {
                if (this._isMounted) {
                    this.setState({ location });
                } else {
                    this._pendingLocation = location;
                }
            });
        }
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._pendingLocation) {
            this.setState({ location: this._pendingLocation });
        }
    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
            this._isMounted = false;
            this._pendingLocation = null;
        }
    }

    render() {
        return (
            <RouterContext.Provider
                value={{
                    history: this.props.history,
                    location: this.state.location,
                    match: Router.computeRootMatch(this.state.location.pathname),
                    staticContext: this.props.staticContext,
                }}
            >
                <HistoryContext.Provider children={this.props.children || null} value={this.props.history} />
            </RouterContext.Provider>
        );
    }
}
```

从 Router 组件的 render 方法可以看出外层有两层 SomeContext.Provider 包裹。

    -   最外层是RouterContext.Provider。该 provider 的 value 值有 history、location、match。
    -  第二层是HistoryContext.Provider。有两个props。value值是history对象。children就是我们真实使用的children。

这里的 Router 其实还不是我们项目中用到的 Router，我们在 web 常用中常用到的是 BrowserRouter,这个组件是 react-router-dom 项目的导出，从名字中可以看出，BrowserRouter 是在 Router 组件外又包了一层 Browser 的新组件，同时 react-router-dom 相对 react-router 多了一个 dom，从这个名字可以看出来，react-router-dom 多了一层有关浏览器中运行的配置，也就是 react-router 是一个纯逻辑的一个组件，并没有附带浏览器中运行的特性，就想 history 库中的 createBrowserHistory 相对于 createHistory 一样。到这里其实也看出来，BrowserRouter 就是为 Router 传入了 history 这个 props，这个 history 就是从用 createBrowserHistory 创建的，相应的可以知道 MemoryRouter 是在 Router 组件上传入了一层通过 createMemoryHistory 创建的 history props 的组件。

再回到上述的最外层的 RouterContext.Provider 的 value，这个 value 的 history 就是通过 createSomeHistory 方法创建的，他的值就是 history 库分析中返回的结果:

```js
return {
    location: { pathname, search, hash, state, key },
    action,
    createHref,
    push,
    replace,
    go,
    back,
    forward,
    listen: (createEvents() {
        const handlers = []
        return {
            get length(){ return handlers.length},
            push(fn){
                handlers.push(fn)
                return function() {
                    handlers.filter(item => item !== fn)
                }
            },
            call(){ handlers.forEach(fn => fn()) }
        }
    })(),
    block,
};
```

value 中的 location 就是从 history 中解构出来的 location，value 中的 match 初始化的值包括了`{ path:'/', url:'/', params: {},isExact: pathname === '/'}`.
HistoryContext.Provider 的 value 值就是 history 对象本身。

还有在 Router 组件 mount 时开启了 history 变化的监听

```js
this.unlisten = props.history.listen((location) => {
    if (this._isMounted) {
        this.setState({ location });
    } else {
        this._pendingLocation = location;
    }
});
```

可以看出其实就是当比如调用 push、replace 等方法时，会实时更改 context 的 value 值中的 location 为最新的值。history 库的分析中用到的版本为 v5 版本，调用监听函数时的参数为{action,location}，适用于 react-router 的 v6 版本，这里的 react-router 代码是 v5 版本，依赖的 history 是 v4 版本，参数是可以对的上的。

-   Route。Route 是 react-router 中根据路径渲染页面的主要方式。代码如下

```js
class Route extends React.Component {
    render() {
        return (
            <RouterContext.Consumer>
                {(context) => {
                    invariant(context, 'You should not use <Route> outside a <Router>');

                    const location = this.props.location || context.location;
                    const match = this.props.computedMatch
                        ? this.props.computedMatch // <Switch> already computed the match for us
                        : this.props.path
                        ? matchPath(location.pathname, this.props)
                        : context.match;

                    const props = { ...context, location, match };

                    let { children, component, render } = this.props;

                    // Preact uses an empty array as children by
                    // default, so use null if that's the case.
                    if (Array.isArray(children) && isEmptyChildren(children)) {
                        children = null;
                    }

                    return (
                        <RouterContext.Provider value={props}>
                            {props.match
                                ? children
                                    ? typeof children === 'function'
                                        ? __DEV__
                                            ? evalChildrenDev(children, props, this.props.path)
                                            : children(props)
                                        : children
                                    : component
                                    ? React.createElement(component, props)
                                    : render
                                    ? render(props)
                                    : null
                                : typeof children === 'function'
                                ? __DEV__
                                    ? evalChildrenDev(children, props, this.props.path)
                                    : children(props)
                                : null}
                        </RouterContext.Provider>
                    );
                }}
            </RouterContext.Consumer>
        );
    }
}
```

可以看出它也就是一个 React 组件，但是用到上文分析提到的 RouterContext.Consumer，所以可以得出 Route 组件必须被包裹在 Router 组件内。代码中做了一系列的判断来决定渲染内容，着重看嵌套的三元表达式内容，大致判断过程是 - 如果有 match 属性为 truthy 值 - 再看 match 是怎么来的，一个是顶级 context 中指定的，这个先略过，第二种是当 props 中 path 的值为 truthy 时，通过调用 matchPath 方法得出 match 的值,返回值结构为{path(用户定义的 path),url(一般和 path 一致),isExact,params(定义的参数映射)} - 当 children 时一个函数时，返回 children(props) - 否则当 component 属性为 truthy，则返回 React.createElement(component, props) - 否则当 render 为 truthy 时，返回 render(props) - 否则当 children 是一个函数时，渲染 children(props) - 否则渲染 null

从上述判断过程可以知道 route 根据 props 渲染的重要属性有 path?、children?、component?、render?（这三个渲染优先级从前到后），
所以我们一般在用 react-router 时，会先定义一个所有路由的一个数组，其中每项可能包含这四个 key。
在真实项目中，会定义 component 属性值为渲染组件在 pages 目录中的相对路径，然后写一个工具方法，遍历该数组，将 component 属性的值更改为一个 React.lazy 返回的组件（这是为了用到 react 的懒加载组件特性），然后再次遍历生成真实的 Route 组件，将所有 Route 组件放在 Suspense 组件内（与 React.lazy 对应）,生成真实 route 组件时，传入 route 渲染的必要 props(path,render 方法).

-   Switch 该组件常用是在根据路由渲染 react 组件时，只渲染路由表中第一个匹配到的路由。
    它其实也是一个普通的 React 组件。代码如下：

```js
class Switch extends React.Component {
    render() {
        return (
            <RouterContext.Consumer>
                {(context) => {
                    invariant(context, 'You should not use <Switch> outside a <Router>');

                    const location = this.props.location || context.location;

                    let element, match;

                    // We use React.Children.forEach instead of React.Children.toArray().find()
                    // here because toArray adds keys to all child elements and we do not want
                    // to trigger an unmount/remount for two <Route>s that render the same
                    // component at different URLs.
                    React.Children.forEach(this.props.children, (child) => {
                        if (match == null && React.isValidElement(child)) {
                            element = child;

                            const path = child.props.path || child.props.from;

                            match = path ? matchPath(location.pathname, { ...child.props, path }) : context.match;
                        }
                    });

                    return match ? React.cloneElement(element, { location, computedMatch: match }) : null;
                }}
            </RouterContext.Consumer>
        );
    }
}
```

从代码中可以看出 Switch 也是必须被包裹在 Router 组件内，它实现只渲染一个路由的原理就是先遍历 children，也就是所有 Route 组件，找出第一个 path 和当前 pathname 能够匹配上的 route 组件，然后渲染该组件。

-   withRouter 该高阶组件是用处一般是为一个没有路由方法的组件(只有路由表中 Route 组件对应的入口组件才会有路由方法,也就是 consumer 包裹注入解构后的 context 的值)注入当前路由方法，所以代码就是把传入的组件包裹在 RouterContext.Provider 中，为组件的 props 中注入路由方法。代码如下:

```js
function withRouter(Component) {
    const displayName = `withRouter(${Component.displayName || Component.name})`;
    const C = (props) => {
        const { wrappedComponentRef, ...remainingProps } = props;

        return (
            <RouterContext.Consumer>
                {(context) => {
                    invariant(context, `You should not use <${displayName} /> outside a <Router>`);
                    return <Component {...remainingProps} {...context} ref={wrappedComponentRef} />;
                }}
            </RouterContext.Consumer>
        );
    };

    C.displayName = displayName;
    C.WrappedComponent = Component;

    if (__DEV__) {
        C.propTypes = {
            wrappedComponentRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
        };
    }

    return hoistStatics(C, Component);
}
```
