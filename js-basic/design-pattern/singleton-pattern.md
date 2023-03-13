# 单例模式

## 定义

> 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

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

// 通过代理
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

## 理解

保证只有一个实例，并不是说不能 new 两次构造函数，而是在构造函数之上还有一个获取实例对象的方法（其实是代理了原构造函数），该方法获取的实例都是通过原构造函数初始化的，当调用两次该方法时，会判断是否已有实例被创建(两种判断：一种是闭包一种是面向对象的在构造函数对象上挂载已创建的实例，通过 this 访问),保证只有同一个实例返回。

## 案例

-   线程池
-   全局缓存
-   浏览器中的 window 对象。确定宿主环境后，全局对象都是唯一的，全局对象本身就是一个单例。
-   网页登录浮窗。登录或者其他类型的浮窗，在全局都是唯一的，在显示隐藏弹窗时，应该确保只会有一个弹窗，第一次时创建，第二次时修改样式（而不会再次创建）。
    如下代码：在点击页面某处第一次出现弹框时，也就是调用 Login.getInstance()，第一次创建，第二次显示第一个。

```js
class Login {
    //构造器
    constructor() {
        this.init();
    }

    //初始化方法
    init() {
        //新建div
        let mask = document.createElement('div');
        //添加样式
        mask.classList.add('mask-layer');
        //添加模板字符串
        mask.innerHTML = `弹窗内容`;
        //插入元素
        document.body.insertBefore(mask, document.body.childNodes[0]);

        //注册关闭登录框事件
        Login.addCloseLoginEvent();
    }

    //静态方法: 获取元素
    static getLoginDom(cls) {
        return document.querySelector(cls);
    }

    //静态方法: 注册关闭登录框事件
    static addCloseLoginEvent() {
        this.getLoginDom('.close-btn').addEventListener('click', () => {
            //给遮罩层添加style, 用于隐藏遮罩层
            this.getLoginDom('.mask-layer').style = 'display: none';
        });
    }

    //静态方法: 获取实例(单例)
    static getInstance() {
        if (!this.instance) {
            this.instance = new Login();
        } else {
            //移除遮罩层style, 用于显示遮罩层
            this.getLoginDom('.mask-layer').removeAttribute('style');
        }
        return this.instance;
    }
}
```
