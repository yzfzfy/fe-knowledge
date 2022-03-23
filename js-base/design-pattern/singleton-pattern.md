# 单例模式

## 定义

> 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

## 案例

-   线程池
-   全局缓存
-   浏览器中的 window 对象
-   网页登录浮窗

## 实现

```js
// 单例设计模式的实现：面向对象
var Singleton = function (name) {
    this.name = name;
    this.instance = null;
};
Singleton.prototype.getName = function () {
    return this.name;
};
Singleton.getInstance = function (name) {
    if (!this.instance) {
        this.instance = new Singleton(name);
    }
    return this.instance;
};

var instance1 = Singleton.getInstance('why');
var instance2 = Singleton.getInstance('www');
console.log(instance1 === instance2); // 输出true

var obj1 = new Singleton('why');
var obj2 = new Singleton('www');
console.log(obj1.getName()); // 输出why
console.log(obj2.getName()); // 输出www

// 单例设计模式的实现：闭包
var Singleton = function (name) {
    this.name = name;
};
Singleton.prototype.getName = function () {
    return this.name;
};
Singleton.getInstance = (function () {
    var instance = null;
    return function (name) {
        if (!instance) {
            instance = new Singleton(name);
        }
        return instance;
    };
})();

var instance1 = Singleton.getInstance('why');
var instance2 = Singleton.getInstance('www');
console.log(instance1 === instance2); // 输出true

var Constructor = function (name) {
    this.name = name;
};

var ProxySingletonConstructor = (function () {
    var instance;
    return function (name) {
        if (!instance) {
            instance = new Constructor(name);
        }
        return instance;
    };
})();

var a = new ProxySingletonConstructor('sven1');
var b = new ProxySingletonConstructor('sven2');

console.log(a === b); //true
```
