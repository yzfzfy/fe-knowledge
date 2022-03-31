# requestAnimationFrame

## 定义

该函数被定义在全局变量 window 上，用于告诉浏览器--你希望执行一个动画并且要求浏览器在下次重绘之前调用指定的回调函数更新动画，。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下次重绘之前执行。
定义到这，其实只执行了一次回调函数，如果想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数内部，必须再次调用 window.requestAnimationFrame()

## 语法

```js
const id = window.requestAnimationFrame(callback);
window.cancelAnimationFrame(id);
// 参数

// callback会接收一个DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，他表示requestAnimationFrame()开始去执行回调函数的时刻。

// 返回值 一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。
```
