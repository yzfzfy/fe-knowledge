# 生命周期

类组件中生命周期以执行顺序罗列

## constructor (props)

组件初始化阶段。在此阶段会初始化组件状态、绑定组件实例方法的上下文等工作。

## static getDerivedStateFromProps props, state

是一个静态方法，所以在此函数中无法获取 this。在初始挂载周期及后续更新时都会调用。他应该返回对象，此对象会合并在组件 state 中，如果返回 null，说明不更新内容。不要返回 null。但是返回 null 时，依然会走到 render 阶段。若不想走到 render，需要依靠 shouldComponentUpdate。

此函数需要是一个纯函数，而且最好在函数中判断 props 和 state 中字段值的差异。避免不必要的更新。

此周期只适合罕见的例子。用到它就意味着 state 中的某个状态需要保持与 props 同步。往往这样的问题我们可以直接使用 props 就可以，即受控模式。

## shouldComponentUpdate(nextProps, nextState)

此函数返回布尔值，react 会使用该布尔值判断当前组件是否需要重新渲染，大部分情况不应该依靠此值判断。想要控制是否渲染可以使用 React.PureComponent 或者使用 React.memo 包装组件。

## render

执行 render，生成虚拟 dom，供 react 渲染真是 dom。

## getSnapshotBeforeUpdate(prevProps, prevState)

能够在最近一次渲染输出之前调用。一般在 UI 处理中会用到，如需要以特殊方式处理滚动位置等。

此函数返回任何值或者 null。返回值会作为 componentDidUpdate 的第三个参数出现。

## componentDidMount

首次渲染后，组件插入 dom 树中。此阶段适合依赖于 dom 节点创建的逻辑。

## props 改变/setState 改动/forceUpdate

react 组件刷新主要有三种方式。props 改变、state 改变、forceUpdate 函数执行。

三种方式中，props 与 state 改变会重新进入`getDerivedStateFromProps`=> `shouldComponentUpdate`=>`render`的逻辑中，而 forceUpdate 会略过前两个阶段，强制进入 render 逻辑中。

## componentDidUpdate(prevProps,prevState,snapshot)

组件刷新时，执行完 render 阶段后相比于初始化的进入 componentDidMount 阶段，此时会进入 componentDidUpdate 阶段。

在此周期内我们常会判断一些参数，然后执行我们的副作用。要小心循环调用 setState。

## componentWillUnmount

此组件会在组件卸载及销毁之前调用。一般会做一些清除订阅逻辑。此周期内不应该再调用 setState。因为该组件不会在重新渲染。
