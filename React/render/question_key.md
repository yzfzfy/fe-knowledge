# 关于 key 的问题

## 开发中某段 jsx 是一个 element 数组时，浏览器控制台会警告？

警告信息：提示 each child in an array or iterator should have a unique “key” props.
提示数组的每个元素应传递一个`唯一`的`key`属性。

使用 react 开发页面时，我们的组件（class 组件或函数式组件）最终返回的 jsx 就是我们最终想要展示在页面中的内容，如：`<div className="wrapper">demo text</div>`，中间态为`React.createElement(div,{className: wrapper}, 'demo text')`。当组件的 props 或 state 发生改变时，组件刷新的过程也就是重新返回一套新的 jsx 片段用来渲染页面，但是当 React App 的组件层级很深时，如果每次状态刷新都将所有 dom 节点重新展示，未免性能损耗太大。所以在刷新时，react 会对比新的 jsx 片段与旧的 jsx 片段的差异（其实也不是 jsx 片段差异而是由 jsx 转换的 js 对象：虚拟 dom 的差异），将变化的节点刷新，不变的保持不动。

这里的变化如何判断呢？

当然我们首先想到的是 html 节点的 nodeType 不同。当解析到该位置时，如果该处的节点类型改变时，那么这个节点及所有子孙节点都会重新销毁而生成新的节点，相应的这些节点组件中的状态也被销毁（unmount）。如果节点类型没有改变，那么只会更新组件修改的属性。

在数组节点渲染时，每次渲染都是产生一个 element 列表，因为通常数组元素会有排序、添加、删除等行为，所有产生的元素的位置可能改动，所以没有必要每次渲染时都将每个元素重新渲染，只需要将改动过的元素重新渲染。其他的保持不变。但是数组元素可能一般类型都相同，如都为返回一个`li`元素，那么怎么判断出哪些元素改动呢？

答案就是使用`key`属性.

为每个元素传递 key 属性后，重新渲染时，比较两颗节点树，key 相同的节点认为是同一个节点，不执行销毁过程，没有出现过的 key 执行 mount 过程，key 被删除的执行 unmount 过程。这样达到提高性能的目的。

可以看出 key 的作用是标识了元素的唯一性。

## 如果设置的 key 不唯一、不稳定，有什么问题？

如果同一个节点 key 不一致，那么 key 的设置就相当于失效了。

- 不唯一的情况：两个元素设置了同一个 key 属性。

```jsx
<ul>
  {[1, 1, 2, 2].map((val) => (
    <li>{val}</li>
  ))}
</ul>
```

React 会认为 key 值相同的两个元素其实是一个元素，后一个具有相同 key 值的元素会被忽略。

- 不稳定的情况：元素 key 使用 Math.random()设置

对比前后树所有节点的 key 值不相同，也就是全部元素被销毁重新渲染。

## 既然优化性能，为什么不将所有的元素传递 key 值，而只会在 array 时警告？

比较一下两种情况生成的元素

```jsx
<ul>
  <li>1</li>
  <li>2</li>
</ul>;
//case2
function App() {
  return React.createElement(
    "ul",
    null,
    React.createElement("li", { key: 1 }, "1"),
    React.createElement("li", { key: 2 }, "2")
  );
}

<ul>{[<li key={1}>1</li>, <li key={2}>2</li>]}</ul>;

//case1
function App() {
  return React.createElement("ul", null, [
    React.createElement("li", { key: 1 }, "1"),
    React.createElement("li", { key: 2 }, "2"),
  ]);
}
```

我们发现第一个场景中，子元素的传入以数组的形式传入第三个参数，但是在第二个场景中，子元素是以参数的形式依次传入的。在第二种场景中，每个元素出现在固定的参数位置上，React 就是通过这个位置作为天然的 key 值去判别的，所以你就不用传入 key 值的，但是第一种场景下，以数组的类型将全部子元素传入，React 就不能通过参数位置的方法去判别，所以就必须你手动地方式去传入 key 值。

## 为什么不建议使用元素索引作为 key？

不建议即**不是一定会有问题**。

哪些情况是没问题的：

- 当列表数据是静态的
- 该列表不会被过滤（从列表中添加/删除项目）。

有问题的例子：

[官方例子](https://codepen.io/pen?editors=0010)

## 引用

- [对子节点进行递归](https://zh-hans.reactjs.org/docs/reconciliation.html#recursing-on-children)
- [[React 技术内幕] key 带来了什么](https://juejin.cn/post/6844903493900173320)
- [深入源码不背概念，五个问题刷新你对于 key 的认知 ](https://www.cnblogs.com/echolun/p/16440172.html)
