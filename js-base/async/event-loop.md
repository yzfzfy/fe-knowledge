# Event-Loop

理解事件循环

Wikipedia 解释:

> In computer science, the event loop is a programming constructor design pattern that waits for and dispatches events or messages in a program. The event loop works by making a request to some internal or external "event provider" (that generally blocks the request util an event has arrived), then calls the relevant event handler ("dispatches the event"), The event loop is also sometimes referred to as the message dispatcher,message loop,message pump,or run loop

总结:
**_事件循环是一个程序结构,用于等待和分派消息和事件.其实就是 js 代码的运行机制,协调 javascript 单线程运行时不会阻塞的一种机制_**

# 进程与线程的定义

1. 进程: CPU 进行资源分配的最小单位 (如电脑中的 QQ)
2. 线程: CPU 进行调度的最小单位 (如 QQ 的每个任务)

# JS 中的单线程

Javascript 从诞生起就是个单线程,原因大概是不想让浏览器变得太复杂,因为多线程需要共享资源,且有可能修改彼此的运行结果,对于一种网页脚本语言来说就太复杂了.

准确的说 javascript 的单线程是 javascript 引擎是单线程的.

在宿主环境中(大部分是浏览器),需要渲染 DOM,而 js 可以操作 DOM.js 执行时,浏览器 DOM 渲染停止.如果不是单线程,那么可以同时执行多段 js,他们都可能操作 DOM,如果操作同一个 DOM 元素,那么就可能出现冲突.

# 浏览器的多线程

1. 在浏览器中打开一个新的标签页时,就是创建了一个新的进程.
2. 同时如果通过一个页面打开的另一个页面属于同一站点的话,那么这个页面会复用父页面的渲染进程.

# 浏览器主线程中有哪些线程

1. GUI 渲染线程
    - 绘制页面,解析 HTML,CSS,构建 DOM 树,布局和绘制等.
    - 页面重绘和回流
    - 与 js 引擎线程互斥,也就是常说的 js 执行阻塞页面更新
2. JS 引擎线程
    - 负责 JS 脚本代码的执行
    - 负责执行准备好待执行的事件,即定时器计数结束,或异步请求成功并正确返回的事件
    - 与 GUI 渲染线程互斥,执行时间过长会阻塞页面的渲染
3. 事件触发线程(应该就是任务队列)
    - 负责将准备好的事件交给 JS 引擎线程执行
    - 多个事件加入任务队列时,需要排队等待(JS 的单线程)
4. 定时器触发线程
    - 负责执行异步的定时器类的事件,如 setTimeout setInterval
    - 定时器到时间之后把注册的回调加到任务队列的队尾
5. HTTP 请求线程
    - 负责执行异步请求
    - 主线程执行代码遇到异步请求时会把函数交给该线程处理.当监听到状态变更事件,如果有回调函数,该线程会把回调函数加入到任务队列的队尾等待执行

来源链接: [你不知道的 Event Loop](https://mp.weixin.qq.com/s/ETDqdo3JIcUxbeIlddSq-Q)

陈述注意点：**eventloop 是什么=>单线程=>为什么单线程=>浏览器还有什么线程 宏任务=>微任务**
