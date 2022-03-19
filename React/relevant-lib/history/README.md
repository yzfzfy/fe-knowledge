# react-router 依赖的底层路由方案

## 简介

Manage session history with JavaScript

## 相关链接

-   [history](https://github.com/remix-run/history)

## 前置知识：

在浏览器地址栏中的 url 可能由以下部分组成:

```js
const url = `http://baidu.com?query=123#name`;

// 分析url的各部分组成后,其实就是浏览器全局对象中的location对象的部分属性

window.location = {
    pathname: 'baidu.com',
    search: '?query=123',
    hash: '#name',
    // 还有其他属性
    // ...
};
```

chrome 的 history 对象的 pushState 方法使用

```js
history.pushState(state, title[, url])
history.replaceState(state, title[, url])
window.addEventListener('popstate', function() {});
```

-   state 状态对象是一个 JavaScript 对象，它与 pushState()创建的新历史记录条目相关联。 每当用户导航到新状态时，都会触发 popstate (en-US)事件，并且该事件的状态属性包含历史记录条目的状态对象的副本。

-   title
    当前大多数浏览器都忽略此参数，尽管将来可能会使用它。 在此处传递空字符串应该可以防止将来对方法的更改。 或者，您可以为要移动的状态传递简短的标题。

-   url 新历史记录条目的 URL 由此参数指定。 请注意，浏览器不会在调用 pushState() 之后尝试加载此 URL，但可能会稍后尝试加载 URL，例如在用户重新启动浏览器之后。 新的 URL 不必是绝对的。 如果是相对的，则相对于当前 URL 进行解析。 新网址必须与当前网址相同 origin； 否则，pushState()将引发异常。 如果未指定此参数，则将其设置为文档的当前 URL。

## 源码分析（先以 createBrowserHistory 为例）

`history`库的主要的导出就是维护一个 history 对象，该对象包括了浏览器历史记录堆栈和操作堆栈的一些方法。
大致有一下属性:

```js
export interface History {
  /**
   * The last action that modified the current location. This will always be
   * Action.Pop when a history instance is first created. This value is mutable.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.action
   */
  readonly action: Action;

  /**
   * The current location. This value is mutable.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.location
   */
  readonly location: Location;

  /**
   * Returns a valid href for the given `to` value that may be used as
   * the value of an <a href> attribute.
   *
   * @param to - The destination URL
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.createHref
   */
  createHref(to: To): string;

  /**
   * Pushes a new location onto the history stack, increasing its length by one.
   * If there were any entries in the stack after the current one, they are
   * lost.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.push
   */
  push(to: To, state?: any): void;

  /**
   * Replaces the current location in the history stack with a new one.  The
   * location that was replaced will no longer be available.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.replace
   */
  replace(to: To, state?: any): void;

  /**
   * Navigates `n` entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   *
   * @param delta - The delta in the stack index
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.go
   */
  go(delta: number): void;

  /**
   * Navigates to the previous entry in the stack. Identical to go(-1).
   *
   * Warning: if the current location is the first location in the stack, this
   * will unload the current document.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.back
   */
  back(): void;

  /**
   * Navigates to the next entry in the stack. Identical to go(1).
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.forward
   */
  forward(): void;

  /**
   * Sets up a listener that will be called whenever the current location
   * changes.
   *
   * @param listener - A function that will be called when the location changes
   * @returns unlisten - A function that may be used to stop listening
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.listen
   */
  listen(listener: Listener): () => void;

  /**
   * Prevents the current location from changing and sets up a listener that
   * will be called instead.
   *
   * @param blocker - A function that will be called when a transition is blocked
   * @returns unblock - A function that may be used to stop blocking
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.block
   */
  block(blocker: Blocker): () => void;
}
```

重要的一些属性如`push`,`replace`,`go`,`back`,`forward`。这些方法名都是参照浏览器 history 对象内置的一些属性抽象出来的。如浏览器中 pushState 对应这里的 push 方法、replaceState 对应这里的 replace。在浏览器中页面跳转就是对应操作 history 对象中的方法。
如 push 方法，在 createBrowserHistory 中主要是操作全局 history 对象中的 pushState 方法和维护其他状态。replace、go 同理。

在 createMemoryHistory 情况中，此时宿主环境中没有 history 对象。这时就是操作内存中初始化的记录堆栈，如在 push 时，操作的是堆栈的 splice 方法，replace 时，操作的是直接修改堆栈对应索引上的值。
