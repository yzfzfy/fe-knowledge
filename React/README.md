# REACT

## React 是什么

React 是一个开源二点用于构建用户界面的前端 js 库，尤其是单页面应用。

## React 的主要特征有哪些

-   使用虚拟 DOM 代码真实 DOM 的耗费资源的操作
-   支持服务端渲染
-   单向数据流
-   开发模式是以组件为基础的，强调组件的可复用性和由组件构成页面

## jsx

jsx 是一个类 xml 的 js 语法扩展。最终还是描述了页面 dom 结构，只不过会由 React.creatElement()生成 js 对象，然后映射到真实 dom。优点是 dom 的结构化描述性。

## react 组件(Component)和元素(Element)

元素是由 React.createElement(name,props,children)生成的对象

```js
{
  type: 'div',
  props: {
    children: 'Login',
    id: 'login-btn'
  }
}
```

最终这个对象会交给 ReactDom.render()渲染为真实 dom。

组件是一个接收 props 返回元素的函数或者是类，为类时，需要写 render 方法返回元素。

## PureComponent 与 Component 区别

PureComponent 是在 Component 基础上又封装了 shouldComponentUpdate 方法，该方法中浅对比了 props 和 state，决定是否重新渲染，判断返回的结果为 true 就是重新渲染。

## React 中的 state 是什么？

一个组件需要展示数据和有一些数据的状态，这些数据就成为了一个组件的 state，通过这些数据的改变，来引起组件显示的改变。

## React 中的 props 是什么？

props 相当于是父组件（或者祖先组件）传给子组件的参数，jsx 上表现就是所有的标签名之外的参数就会在组件中以 this.props 接收(类组件)。

## props 和 state 的异同

相同点：首先他们都是 js 对象。对象上都保存了一些影响页面展示的数据，
不同点：props 来源是父组件（或者祖先组件）传给子组件的参数，统一在这里接收，state 是属于当前组件的内部数据，一般只影响当前组件内部状态，如果传给子孙组件，当当前组件的 state 改变时，子组件会在 props 中接收到父组件传来的改变。

## 我们为什么不能像修改 js 对象那样修改 state

state 一般的作用是会影响到渲染的，重新渲染是需要重新生成 element，比如在类组件中，重新生成 element 的操作只有重新执行 render 方法，那么重新执行的时机是需要 react 控制的，普通的修改 js 对象，js 是不会捕捉到这个操作的，需要执行 react 提供的方法，让 react 收到这个操作后就重新执行 render 就可以了。这个 react 提供的操作就是挂载在组件实例上的 setState 方法。

## setState 方法的第二个参数，有什么用？

首先第二个参数是一个函数对象，并且回调函数，回调在 setState 的操作完成并且页面被正确渲染完成后就会被调用执行。

## html 和 react 的事件绑定区别

-   书写
    html 的事件绑定是小写事件名在标签中`onclick="()"`
    react 的事件绑定是要小驼峰的形式写在 jsx props 位置的。`<button onClick={activateLasers}>`

-   阻止默认事件

html 中`return false` react `e.preventDefault()`

-   ()的写法

上边的写法中写到了。html 标签中的事件名后紧跟了`()`,而 react 中只传递了函数名。

## jsx 中的事件绑定

如 onClick 方法，传递函数名，函数处理逻辑中会有改变组件状态的 this.setState 方法，但是因为 this 语法的特殊性，如果这里直接写 this.setState,那么 this 不是指向该组件的，所以要将 this 绑定指向到该组件，

-   在 constructor 中做 bind 绑定。
-   使用新语法，Public class fields syntax。实例的函数属性使用箭头函数定义，this 就被默认绑定到定义时的指向。

## react 中的合成事件

合层事件是对于浏览器原生事件的包装，因为各种浏览器对于事件的处理可能不同，react 的事件处理逻辑肯定要书写一致，不同浏览器的处理不同就交给 react 来抹平了，就是通过合成事件实现的。所以我们在 jsx 中写的 onClick 事件并不是直接赋在 html 标签的原生的 onclick 方法，是 react 包装过的。

## key props 的作用

key 是一个特殊的 prop，在子组件的 props 中不会接收到这个 key。当创建一个数组元素渲染时，应该传递 key 属性，react 内部使用它来识别数组元素，哪些被改动，移除或者添加删除了。

那么应该传递给 key 什么值呢？

传递给 key 的值应该是稳定的，一对一的，最好不要一个 key 的值可能对应数组的不同元素。所以一般用数组的 id 来表示唯一。

如果没有稳定的 id，那么会用索引来做。这么做的话，如果这个数组的元素的顺序是可以变动的，那么会有性能问题，这是不推荐的。

note：如果循环渲染的元素是一个封装的组件，那就把 key 属性赋值在组件的 props 上，而不是在组件内部；如果一个列表元素没有 key 属性，react 会发出一个警告

## ref

ref 代表一个引用，它可以引用任何值。他的值使用 ref.currenth 获取。当设置在 jsx 的 ref 属性上时，如果这个 jsx 元素是一个原生 html tag，那么这个 ref 的值引用就是这个 dom 元素；如果这个 jsx 元素是 react 组件，那就引用的是这个组件，通过 ref 可以获取该组件实例；其他情况就是将 ref 当作一个普通的 js 对象使用，他的引用是稳定的，不会修改指向。

在用 ref 赋值给 dom 之前使用 findDOMNode(),已经是过时的 api，因为它阻止了 react 未来可能的优化策略。

### 创建 ref

类组件： `this.myRef = React.createRef()`
函数组件：`const myRef = useRef()`
回调函数 ref：这里的回调函数接收 React 组件实例或 html dom 元素作为参数 `<component ref={e=>{this.ref = e}}>`，react 会在组件挂载时，调用 ref 回调函数并传入 dom 元素、组件，当卸载时，调用它并传入 null，并且在 didmount 和 didupdate 触发前，保证 ref 是最新的

字符串 ref 已不推荐使用。

### forwardRef

利用它，可是实现让组件获取他们收到的 props 中写的 ref，从而把该 ref 赋给组件的元素甚至子组件下。

## 虚拟 dom

### 定义

虚拟 dom 是存在与内存中对于真实 dom 描述的 js 对象，它与真实 dom 的结构保持同步。在 render 函数调用后，直到 dom 被真实渲染在屏幕上，有一个过程叫*协调*

### 虚拟 dom 如何工作

分为简单的三步

1. 一个组件树的状态数据修改时，整个 ui 会被重新渲染，重新渲染需要依赖虚拟 dom 生成。
2. 生成虚拟 dom 后，就需要与旧的虚拟 dom 树进行对比，找出差异
3. 对比差异后，真实的 dom 被更新，_这里被更新就是状态数据影响的那部分，其他部分不会被更新_。

### shadowDom 与 virtualDom 的不同

完全是两个不同的东西。shadowdom 是一个浏览器提供的新的功能，为 web 组件和 css 添加了作用域范围。
而虚拟 dom 是 js 库的作者开发库时的设计概念和名词。

## react fiber

在 react 16 版本中，react 官方引入了新的核心协调引擎。他的作用在于处理 react 状态更新时，更合理的处理页面展示更新的优先级或者暂停、开始等更新任务。[了解更多](https://github.com/acdlite/react-fiber-architecture)

-   可以将任务分割成可以中断的任务碎片
-   能够处理优先级高的任务、重置任务状态、重新开始任务
-   Ability to yield back and forth between parents and children to support layout in React.
-   Ability to return multiple elements from render().
-   Better support for error boundaries.

## 受控组件和非受控组件

受控：顾名思义就是组件的状态是被外部控制的，不受自己控制。非受控相反。通常就是一个组件的状态是接收外部的 props 控制，当组件状态改变也是通过外部 props 改变通知到组件内部的。非受控组件是内部状态是自己的内部的状态，外部想要获取该组件的状态需要通过其他途径获取（ref）

## createElemtn 与 cloneElement

createElement 是 jsx 底层的调用函数，返回一个新的 react 元素。cloneElement 是用一个元素作为模板，支持重新赋值它的 props（chldren、key、ref），新的 props 与旧的 props 的合并策略是浅合并，新的 props 中没有的 prop 将使用旧的 props 中的 prop。

```jsx
React.cloneElement(
  element,
  [config],
  [...children]
)
// 其实就相当于
<element.type {...element.props} {...props}>{children}</element.type>
```

## 生命周期

首先是 react 组件的三个不同阶段：

1. 挂载中。组件的数据状态将反应到 dom 上。与这个阶段有关系的生命周期有`constructor`,`getDerivedStateFromProps`,`render`,`componentDidMount`
2. 更新中。有两种方式可以将组件状态转化为更新中。props 改变和 state 改变（setState 和 forceUpdate）。与这个阶段有关系的生命周期有`getDerivedStateFromProps`，`shouldComponentUpdate`,`render`,`getSnapshotBeforeUpdate`,`componentDidUpdate`
