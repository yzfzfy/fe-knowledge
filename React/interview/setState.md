# react 中的 setState

## 是否异步

1. 首先执行 this.setState 语句肯定是同步的
2. 执行完两次 this.setState 后，react 决定是否渲染(也就是 render 方法)，有两种情况
   - 如果此次是发生在 react 可参与、可控制范围内，(生命周期、react 合成事件)那么两次 set 只会引起一次 render
   - 如果发生在 react 不可控范围(定时器 setTimeout setInterval、原生事件监听等),那么有几次 set 就会有几次 render

第一种情况下只会有一次 render，第二次会有两次

```jsx
this.setState({ a: 1 });
this.setState({ a: 2 });
```
