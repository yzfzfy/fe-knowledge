# 装饰者模式

## 定义

装饰者模式可以动态的给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象。

## 应用

```js
// AOP应用
// 数据上报
Function.prototype.before = function (beforeFn) {
    var _self = this;
    return function () {
        beforeFn.apply(this, arguments);
        return _self.apply(this, arguments);
    };
};
Function.prototype.after = function (afterFn) {
    var _self = this;
    return function () {
        var ret = _self.apply(this, arguments);
        afterFn.apply(this, arguments);
        return ret;
    };
};
var showLogin = function () {
    console.log('打开登录浮层');
};

// 依次输出：按钮点击之前上报  打开登录浮层  按钮点击之后上报
document.getElementById('btnLogin').onclick = showLogin
    .before(function () {
        console.log('按钮点击之前上报');
    })
    .after(function () {
        console.log('按钮点击之后上报');
    });
```

## 案例

[案例 1](https://wangtunan.github.io/blog/designPattern/#%E8%A3%85%E9%A5%B0%E8%80%85%E6%A8%A1%E5%BC%8F)
[案例 2](https://github.com/Nealyang/YOU-SHOULD-KNOW-JS/blob/master/doc/design%20mode/%E8%A3%85%E9%A5%B0%E7%9D%80%E6%A8%A1%E5%BC%8F.md)
